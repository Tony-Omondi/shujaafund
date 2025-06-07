from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
import requests
import json
from fundraisers.models import Fundraiser, Donation
from .models import Transaction
import logging

logger = logging.getLogger(__name__)

@require_POST
@csrf_exempt
def initiate_payment(request):
    try:
        data = json.loads(request.body)
        fundraiser_id = data.get('fundraiser_id')
        amount = float(data.get('amount'))
        is_anonymous = data.get('is_anonymous', False)
        in_memory_of = data.get('in_memory_of', '')
        message = data.get('message', '')
        email = request.user.email if request.user.is_authenticated else data.get('email')

        logger.debug(f"Initiate payment: fundraiser_id={fundraiser_id}, amount={amount}, email={email}")

        if not email or amount < 100:
            return JsonResponse({'status': False, 'message': 'Invalid email or amount'}, status=400)

        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id)
        donation = Donation.objects.create(
            fundraiser=fundraiser,
            donor=request.user if request.user.is_authenticated else None,
            amount=amount,
            is_anonymous=is_anonymous,
            in_memory_of=in_memory_of,
            message=message
        )

        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_TEST_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'email': email,
            'amount': int(amount * 100),  # Convert to kobo
            'callback_url': settings.PAYSTACK_CALLBACK_URL,  # Use ngrok or public URL
            'metadata': {
                'donation_id': str(donation.id),
                'fundraiser_id': str(fundraiser.id),
            }
        }

        logger.debug(f"Paystack payload: {payload}")

        response = requests.post(settings.PAYSTACK_INITIALIZE_URL, headers=headers, json=payload)
        response_data = response.json()

        logger.debug(f"Paystack response: {response_data}")

        if response.status_code == 200 and response_data.get('status'):
            Transaction.objects.create(
                donation=donation,
                reference=response_data['data']['reference'],
                amount=amount,
                paystack_response=response_data
            )
            return JsonResponse({
                'status': True,
                'authorization_url': response_data['data']['authorization_url'],
                'reference': response_data['data']['reference']
            })
        logger.error(f"Paystack error: {response_data}")
        return JsonResponse({'status': False, 'message': response_data.get('message', 'Payment initialization failed')}, status=400)

    except Exception as e:
        logger.error(f"Exception in initiate_payment: {str(e)}")
        return JsonResponse({'status': False, 'message': str(e)}, status=500)

@require_POST
@csrf_exempt
def payment_callback(request):
    reference = request.GET.get('reference')
    if not reference:
        logger.error("Missing reference in callback")
        return redirect('/thank-you/?error=missing_reference')

    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_TEST_SECRET_KEY}',
        'Content-Type': 'application/json',
    }

    try:
        response = requests.get(f"{settings.PAYSTACK_VERIFY_URL}/{reference}", headers=headers)
        response_data = response.json()

        logger.debug(f"Paystack verify response: {response_data}")

        if response.status_code == 200 and response_data['status'] and response_data['data']['status'] == 'success':
            transaction = get_object_or_404(Transaction, reference=reference)
            transaction.status = 'SUCCESS'
            transaction.paystack_response = response_data
            transaction.save()

            donation = transaction.donation
            fundraiser = donation.fundraiser
            fundraiser.amount_raised += donation.amount
            fundraiser.save()

            # Send thank-you email
            subject = 'Thank You for Your Donation to ShujaaFund'
            message = (
                f"Dear {'Donor' if donation.is_anonymous else donation.donor.username},\n\n"
                f"Thank you for your generous donation of KSh {donation.amount} to {fundraiser.title}.\n"
                f"Your support makes a huge difference!\n\n"
                f"Fundraiser: {fundraiser.title}\n"
                f"Message: {donation.message or 'No message provided'}\n"
                f"{'In memory of: ' + donation.in_memory_of if donation.in_memory_of else ''}\n\n"
                f"Best regards,\nShujaaFund Team"
            )
            recipient = donation.donor.email if donation.donor else response_data['data']['customer']['email']
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient],
                fail_silently=False,
            )

            logger.info(f"Payment successful: {reference}")
            return redirect('/thank-you/?success=true')
        logger.error(f"Payment verification failed: {response_data}")
        return redirect('/thank-you/?error=payment_failed')

    except Exception as e:
        logger.error(f"Exception in payment_callback: {str(e)}")
        return redirect(f'/thank-you/?error={str(e)}')