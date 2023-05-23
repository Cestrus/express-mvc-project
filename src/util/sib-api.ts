import SibApi from "sib-api-v3-sdk";

enum ENVELOPE {
    "signUp",
    "confirmSignup",
    "changePass",
}

type emailContentType = {
    htmlContent: string;
    subject: string;
};

SibApi.ApiClient.instance.authentications["api-key"].apiKey =
    process.env.SIB_API_KEY;

const apiInstance = new SibApi.TransactionalEmailsApi();

export const sendEmail = async (
    emailAddresses: string | string[],
    emailType: ENVELOPE,
    link?: string
) => {
    const message: emailContentType = getHtml(emailType);

    apiInstance
        .sendTransacEmail({
            sender: { email: "shop@shop.my", name: "MyShop" },

            messageVersions: {
                to: emailAddressMap(emailAddresses),
                htmlContent: message.htmlContent,
                subject: message.subject,
            },
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
    const emailsMap = [...emailAddresses].map((email) => {
        return { email };
    });
    return emailsMap;
};

const getHtml = (emailType: ENVELOPE, link?: string): emailContentType => {
    switch (emailType) {
        case ENVELOPE.signUp: {
            return createSignUpHtml();
        }
        case ENVELOPE.confirmSignup: {
            return createConfirmHtml();
        }
        case ENVELOPE.changePass: {
            return createChangePassword(link);
        }
        default:
            return;
    }
};

const createSignUpHtml = (): emailContentType => {
    return {
        htmlContent:
            "<!DOCTYPE html><html><body><h1>Hello!</h1><p>May be you try signup to my SHOP!</p><div>For complate this action pleace click <a href='http://localhost:3000/login'> link </a></div></body></html>",
        subject: "My subject, asshole!",
    };
};

const createConfirmHtml = (): emailContentType => {
    return {
        htmlContent:
            "<!DOCTYPE html><html><body><h1>Congratulations!</h1><p>You signup to my SHOP!</p></body></html>",
        subject: "My subject, asshole!",
    };
};

const createChangePassword = (link: string): emailContentType => {
    return {
        htmlContent:
            "<!DOCTYPE html><html><body><h1>Hello!</h1><p>Sombody try change your password!</p><p>For confirm click this <a href='http://localhost:3000'>link</a></body></html>",
        subject: "My subject, asshole!",
    };
};

// # Include the Brevo library\
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// var defaultClient = SibApiV3Sdk.ApiClient.instance;
// # Instantiate the client\
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = 'YOUR_API_V3_KEY';

// var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
// var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
// # Define the campaign settings\
// emailCampaigns.name = "Campaign sent via the API";
// emailCampaigns.subject = "My subject";
// emailCampaigns.sender = {"name": "From name", "email":"myfromemail@mycompany.com"};
// emailCampaigns.type = "classic";
// # Content that will be sent\
// htmlContent: 'Congratulations! You successfully sent this example campaign via the Brevo API.',
// # Select the recipients\
// recipients: {listIds: [2, 7]},
// # Schedule the sending in one hour\
// scheduledAt: '2018-01-01 00:00:01'
// }
// # Make the call to the client\
// apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
// console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
// console.error(error);
// });

// new SibApiV3Sdk.TransactionalEmailsApi()
//     .sendTransacEmail({
//         sender: { email: "sendinblue@sendinblue.com", name: "Sendinblue" },
//         subject: "This is my default subject line",
//         htmlContent:
//             "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
//         params: {
//             greeting: "This is the default greeting",
//             headline: "This is the default headline",
//         },
//         messageVersions: [
//             //Definition for Message Version 1
//             {
//                 to: [
//                     {
//                         email: "bob@example.com",
//                         name: "Bob Anderson",
//                     },
//                     {
//                         email: "anne@example.com",
//                         name: "Anne Smith",
//                     },
//                 ],
//                 htmlContent:
//                     "<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
//                 subject: "We are happy to be working with you",
//             },

//             // Definition for Message Version 2
//             {
//                 to: [
//                     {
//                         email: "jim@example.com",
//                         name: "Jim Stevens",
//                     },
//                     {
//                         email: "mark@example.com",
//                         name: "Mark Payton",
//                     },
//                     {
//                         email: "andrea@example.com",
//                         name: "Andrea Wallace",
//                     },
//                 ],
//             },
//         ],
//     })
//     .then(
//         function (data) {
//             console.log(data);
//         },
//         function (error) {
//             console.error(error);
//         }
//     );
