
const table = "notifications";

exports.getMany = async (userId, pagination,is_mark_all_seen=false) => {
  try{
    const query = DB(table).where(`user_id`,"=",userId).orderBy("created_at","desc")
    const totalDocuments = await query;

    query
    .limit(pagination?.per_page || 100)
    .offset((pagination?.page - 1) * pagination?.per_page || 0);

    const data = await query;

    if(is_mark_all_seen == "true"){
      await this.markAllUserNotificationsSeen(userId)
    }

    return {status: true, data: data,totalDocuments: totalDocuments.length}
  } catch(err){
    console.log("error : ",err)
    return {status: false}
  }
};

exports.readOne = async (notifId,is_mark_all_seen=false) => {
  try{
    const query = DB(table).where(`id`,"=",notifId);

    const data = await query.update({"isRead":1});


    return {status: true, data: data}
  } catch(err){
    console.log("error : ",err)
    return {status: false}
  }
};

exports.getUnseenNotificationCount = async (userId) => {
  try{
    const res = await DB(table).where(`user_id`,"=",userId).select(DB.raw("COUNT(notifications.id) as notificationCount")).andWhere("isRead","=",0).first()
    return {status: true, count: res.notificationCount};
  } catch(err){
    console.log("error : ",err);
    return {status: false, count: 0};
  }
}

exports.markAllUserNotificationsSeen = async (userId) => {
  try{
    await DB(table).where({"user_id": userId}).update({"isRead":1})
    return {status: true}
  } catch(err){
    return {status: false}
  }
}

exports.create = async (title, user_id, body,type) => {
  try{
    await DB(table).insert({
      title, 
      user_id,
      body,
      type
    })
    return {status: true}
  } catch(err){
    return {status: false}
  }
}

exports.deleteAllUserNotifications = async (user_id) => {
  try{
    await DB(table).where("user_id","=",user_id).del()
    return {status: true}
  } catch(err){
    return {status: false}
  }
}

exports.getNotifSettings = async (userId) => {
  try {
    const data = await DB("users").select("invitation_notif", "job_update_notif").where({"id": userId}).limit(1);
    return {status: true, data: data[0] || {}}
  } catch (error) {
    console.log("error : ", error);
    return {status: false, data: {}}
  }
}

exports.updateNotifSettings = async (query, data) => {
  try {
    const res = await DB("users").where(query).update(data);
    return {status: true, data: res}
  } catch (error) {
    return {status: false, data: []}
  }
}
