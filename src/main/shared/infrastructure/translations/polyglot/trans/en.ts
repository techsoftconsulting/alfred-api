/* eslint-disable @typescript-eslint/camelcase */
const en = {
    admin: {
        emails: {
            newResetPasswordRequest: {
                subject: 'New password reset request',
                content:
                    'Hello, %{adminName}, your dealer %{dealerName} #(%{dealerId}) has sent a request to reset his password',
            },
            newOrderPlaced: {
                subject: 'New order placed',
                content: `Hello, %{adminName}, your dealer %{dealerName} #(%{dealerId}) has placed a new order`,
            },
            orderDetailsUpdated: {
                subject: 'Order completed',
                content: `Hey %{adminName}, your dealer <strong>%{dealerName}</strong> has updated the order  <strong>%{orderReference}</strong> - #%{orderCode}`,
            },
            newRealizationUploaded: {
                subject: 'New realization uploaded',
                content: `Hello, %{adminName}, your dealer %{dealerName} has uploaded a new realization`,
            },
        },
        notifications: {
            newResetPasswordRequest: {
                title: 'New password reset request',
                content:
                    'Hello, %{adminName}, your dealer %{dealerName} #(%{dealerId}) has sent a request to reset his password',
            },
            newOrderPlaced: {
                title: 'New order placed',
                content: `Hello, %{adminName}, your dealer %{dealerName} #(%{dealerId}) has placed a new order: <strong>%{orderReference}</strong>`,
            },
            orderDetailsUpdated: {
                title: 'Order completed',
                content: `Hey %{adminName}, your dealer <strong>%{dealerName}</strong> has updated the order <strong>%{orderReference}</strong> - #%{orderCode}`,
            },
            newRealizationUploaded: {
                title: 'New realization uploaded',
                content: `Hello, %{adminName}, your dealer %{dealerName} has uploaded a new realization`,
            },
        },
    },
    users: {
        emails: {
            welcome: {
                subject: 'Welcome to StoreVan',
                content: `Your credentials are: - Email: %{dealerEmail} - Dealer Id: %{dealerId} - Password: %{plainPassword}`,
            },
            orderSent: {
                subject: 'Your order is on the way',
                content: `Hey, %{dealerName} your order <strong>%{orderReference}</strong> - #%{orderCode} has been sent`,
            },
            orderMarkedAsIncomplete: {
                subject:
                    'Your order (%{orderReference}) has been marked as incomplete',
                content: `Hey, %{dealerName} your order <strong>%{orderReference}</strong> - #%{orderCode} needs more details to be processed. <br> <p> Admin comments: %{comments} </p>. <br/> <p>Enter to your account and complete the requirements</p>`,
            },
            orderStatusChanged: {
                subject: 'Order updates',
                content: `Hey, %{dealerName} your order <strong>%{orderReference}</strong> - #%{orderCode} status has changed. <p> The current status is %{orderStatusName}</p>`,
            },
        },
    },
    orders: {
        status: {
            processing: 'Processing',
            scheduled: 'Scheduled',
            inBackOrder: 'In back order',
            needMoreInfo: 'Need more info',
            sent: 'Sent',
        },
    },
};

export default en;
