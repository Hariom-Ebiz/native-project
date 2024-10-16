const axios = require("axios");
const { getNotifSettings } = require("../models/notification");

// const notificationsTypes = {
//     newPost : "New Post",
//     newLike: "New Like",
//     newComment: "New Comment",
//     eventAssignment: "New Event Assignment",
//     newEvent: "New Event Created",
//     newCircleInvite: "New Circle Invite",
//     newTicketResponse: "New Ticket Response",
//     ticketClose: "Ticket Close",
//     eventReminder: "Event Reminder",
//     profileUpdate: "Profile Update"
// }

module.exports = class Notification {
    constructor(type, userId){ // userId is sender Id
        this.notificationType = type;
        this.currentUserId = userId;
    }

    async formatTemplate(values) {
        const query = DB("notification_template")
        .where("name", "=", this.notificationType).first()

        const notificationTemplete = await query;
        console.log("notificationTemplete",notificationTemplete);
        const title = notificationTemplete?.subject.replace(/{(.*?)}/g, (match, key) => values[key.trim()] || '');
        const body = notificationTemplete?.body.replace(/{(.*?)}/g, (match, key) => values[key.trim()] || '');

        this.template = {title, body};
    }
    
    async sendNotification(userIds, link){
        for await (let userId of userIds){
            try {
                let jobUpdateValids = ["unlock update", "shortlist candidate", "interview schedule", "hire candidate", "reject candidate", "candidate hold"];
                if (jobUpdateValids.includes(this.notificationType)) {
                    let getUserSetting = await getNotifSettings(userId);
                    if (getUserSetting.data.job_update_notif) {
                        const record = await DB("notifications")
                        .insert({
                            title: this.template.title,
                            body: this.template.body,
                            user_id: userId,
                            type: this.notificationType,
                            redirect_link: link
                        })
                        return {status: true, data: record};
                    } 
                } else {
                    const record = await DB("notifications")
                    .insert({
                        title: this.template.title,
                        body: this.template.body,
                        user_id: userId,
                        type: this.notificationType,
                        redirect_link: link
                    })
                    return {status: true, data: record};
                }
            } catch (error) {
                console.log("notification error : ", error);
                return {status: false, data: {}};
            }
        }
    }

    async sendPushNotification(users){
        for await (let user of users){
            await this.sendFirebaseNotif({token: user.deviceId, title: this.template.title, body: this.template.body})
        }
    }

    async sendFirebaseNotif (data) { //{ token: string, body: string, title: string, roomId: string }
        try {    
            let payload = {
                "registration_ids": data.token,
                "notification": {
                    "body": data.body,
                    "title": data.title,
                    "image": null,
                    "badge": "1",
                    "sound": "blackberry.wav",
                    "priority": "high",
                    "notification_foreground": "true"
                },
                "android": {
                    "collapse_key": "deviceId",
                    "priority": "high",
                    "notification": {
                        "notification_android_channel_id": "alarm",
                        "notification_android_sound": "'alarma.wav",
                        "channel_id": "alarm",
                        "sound": "blackberry.wav",
                        "icon": "ic_stat_action_announcement"
                    }
                },
                "apns": {
                    "payload": {
                        "aps": {
                            "sound": "blackberry.wav",
                            "content-available": 1
                        }
                    }
                },
                "data": {
                    "body": data.body,
                    "title": data.title,
                    "image": null,
                    "badge": "1",
                    "priority": "high",
                    "notification_foreground": "true"
                }
            }
    
            let headers = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <token>"
                },
                body: JSON.stringify(payload),
            }
    
            await axios.post("https://fcm.googleapis.com/fcm/send", JSON.stringify(payload), { headers: headers.headers })
    
            return { success: true }
    
        } catch (error) {
            throw new Error(error)
        }
    }
}
