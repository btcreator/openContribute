import showError from './../utils/showResponseError.js';

const stripe = Stripe(
  'pk_test_51OTnIAE0JrWJ25p1gAaXKc1qp4fDFyq9TpBxnntQ8isKneLapslbII6PYW8JLmiZTrzZLDErol6l8I7YlnepooGS00m2GPdeu3'
);

export const contributeFunds = async function (projectId, amount) {
  try {
    // create session on server side
    const session = await axios.post(`/api/v1/contribution/fundsContributionSession/${projectId}`, {
      amount,
    });

    // follow to session checkout
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    showError(err);
  }
};
