export const sendData = async () => {
  const adsChannels = fwmData["ads-channels"]?.selectedChoices.join(", ");
  const customerData = fwmData["customer-data"];
  const goalsTimelines = fwmData["goals-timelines"]?.selectedChoices.join(", ");
  const helpIn = fwmData["help-in"]?.selectedChoices.join(", ");
  const inHouseResources =
    fwmData["in-house-resources"].selectedChoices != null
      ? fwmData["in-house-resources"]?.selectedChoices.join(", ")
      : " ";
  const inMarketingBudget =
    fwmData["in-marketing-budget"]?.selectedChoices.join(", ");
  const marketingGoals = fwmData["marketing-goals"]?.selectedChoices.join(", ");
  const marketingGoalFeedBack = fwmData["marketing-goals"].feedBack;
  const seoKnowledge = fwmData["seo-knowledge"]?.selectedChoices.join(", ");

  const formData = [
    [
      customerData[0].inputValue,
      customerData[1].inputValue,
      customerData[2].inputValue,
      customerData[3].inputValue,
      customerData[4].inputValue,
      helpIn,
      seoKnowledge,
      adsChannels,
      marketingGoals,
      marketingGoalFeedBack,
      goalsTimelines,
      inHouseResources,
      inMarketingBudget,
    ],
    // Additional rows ...
  ];

  //send form data to the server
  const res = await fetch("/.netlify/functions/send_marketing_form_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formData }),
  });

  let text = "Server Error";
  if (res.status && res.status == 404) {
    text = "ERROR: Your email address doesn't exist, please type a valid one.";
  }
  else if (res.status && res.status == 400) {
    text = "ERROR: Data can't be sent.";
  }
  else if (res.status && res.status == 200) {
    text = "Data sent succesfully.";
  }
  return { status: res.status, text };
};
