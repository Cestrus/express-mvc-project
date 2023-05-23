import SibApi from "sib-api-v3-sdk";
import * as dotenv from "dotenv";

export enum ENVELOPE {
    "signUp",
    "confirmSignup",
    "changePass",
}

type emailContentType = {
    htmlContent: string;
    subject: string;
};

dotenv.config();

SibApi.ApiClient.instance.authentications["api-key"].apiKey =
    process.env.SIB_API_KEY;

const apiInstance = new SibApi.TransactionalEmailsApi();

export const sendEmail = async (
    emailAddresses: string | string[],
    emailType: ENVELOPE,
    token?: string
) => {
    const message: emailContentType = getHtml(emailType, token);
    apiInstance
        .sendTransacEmail({
            sender: { email: "shop@shop.my", name: "MyShop" },
            subject: message.subject,
            htmlContent: message.htmlContent,
            messageVersions: [
                {
                    to: emailAddressMap(emailAddresses),
                },
            ],
        })
        .then(
            function (data) {
                console.log(data);
            },
            function (error) {
                console.error(error);
            }
        );
};

const emailAddressMap = (emailAddresses: string | string[]) => {
    let emailsMap = [];
    if (Array.isArray(emailAddresses)) {
        emailsMap = [...emailAddresses];
    } else {
        emailsMap.push(emailAddresses);
    }
    return emailsMap.map((email) => {
        return { email };
    });
};

const getHtml = (emailType: ENVELOPE, token?: string): emailContentType => {
    switch (emailType) {
        case ENVELOPE.signUp: {
            return createSignUpHtml(token);
        }
        case ENVELOPE.confirmSignup: {
            return createConfirmHtml();
        }
        case ENVELOPE.changePass: {
            return createChangePassword(token);
        }
        default:
            return;
    }
};

const createSignUpHtml = (token: string): emailContentType => {
    console.log("token => ", token);
    return {
        htmlContent: `<!DOCTYPE html><html><body><h1>Hello!</h1><p>May be you try signup to my SHOP!</p><div>For complate this action pleace click <a href="http://localhost:3000/login:${token}"> link </a></div></body></html>`,
        subject: "Sign up to mySHOP",
    };
};

const createConfirmHtml = (): emailContentType => {
    return {
        htmlContent:
            "<!DOCTYPE html><html><body><h1>Congratulations!</h1><p>You signup to my SHOP!</p></body></html>",
        subject: "Confirm sign up",
    };
};

const createChangePassword = (token: string): emailContentType => {
    return {
        htmlContent:
            "<!DOCTYPE html><html><body><h1>Hello!</h1><p>Sombody try change your password!</p><p>For confirm click this <a href='http://localhost:3000'>link</a></body></html>",
        subject: "My subject, asshole!",
    };
};
