import axios from "axios";

export async function postCriticalError(message: string, errorDetails: string) {
  const payload: any = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Critical Error in Lambda ${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*CRITICAL ERROR:* ${message}\n${
            errorDetails
              ? "Details: " + JSON.stringify(errorDetails, null, 2)
              : ""
          }`,
        },
      },
    ],
  };
  await axios.post(process.env.SLACK_URL as string, payload);
}
