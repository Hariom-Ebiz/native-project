import React, { useEffect,useState } from 'react'
import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import styles from "@/styles/notifications.module.css";

import useRequest from "@/hooks/useRequest";
import moment from 'moment';
import Link from 'next/link';

const Notification = () => {
    const PER_PAGE = 10;
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [notificationsList, setNotificationsList] = useState([]);
    const { request: requestNotifications, response: responseNotifications } = useRequest()
    const { request } = useRequest()
    const [page, setPage] = useState(1);


    useEffect(() => {
        requestNotifications("get", `notification/all?page=${page}&per_page=${PER_PAGE}&is_mark_all_seen=${true}`)
    }, []);

    const getMoreNotifications = ()=>{
        requestNotifications("get", `notification/all?page=${page+1}&per_page=${PER_PAGE}&is_mark_all_seen=${true}`)
        setPage(page + 1)
    }

    useEffect(() => {
        if (responseNotifications) {
            const { status, totalDocuments, notificationsData } = responseNotifications;
            setTotalNotifications(totalDocuments)
            setNotificationsList(prevNotifications => [...prevNotifications,...notificationsData]);
        }
    }, [responseNotifications])

    const seeNotification = (notifId) => {
        request("GET", `notification/read-one?notifId=${notifId}`)
      }

    return (
        <JobSeekerAuth data={{ title: "Notifications" }}>
            <div className="page_container">
                <div className="main_content">
                    <div className={styles.notification_page}>
                        <h3 className={styles.desh_sectionHead}>Notifications</h3>
                        <div className={styles.notifi_box}>
                            <ul className={styles.notifi_items}>
                                {notificationsList?.map(notif => {
                                    return <li className='position-relative'>
                                        <div className={`${styles.notifINNrow} ${styles.read_notification}`}>
                                            <Link href={(notif.redirect_link) ? notif.redirect_link : "#"} onClick={() => seeNotification(notif.id)} className={styles.notif_info}>
                                                <h5 className={styles.notiTitle} style={{textTransform: "capitalize"}}>{notif.title}</h5>
                                                <p className={styles.notifDtl} style={{textTransform: "capitalize"}}>{notif.body}</p>
                                            </Link>
                                            <span className={styles.notifTime}>{moment(notif.created_at).format('DD MMM YYYY [at] h:mm A')}</span>
                                        </div>
                                        {!notif.isRead && <div style={{height: "12px", width: "12px", background:"red", borderRadius: "50%", top: "10px", right:10}} className='position-absolute'></div>}
                                    </li>
                                })}
                            </ul>
                            {notificationsList.length == 0 && <p>No Notifications Found!</p>}
                            {notificationsList.length < totalNotifications && <div style={{display:"flex", justifyContent:"center"}}><button className={styles.view_btn} onClick={getMoreNotifications} style={{ background:"transparent", border:"none",display:"inline-block", width:"auto"}}>View More</button></div>
                        }
                        </div>
                    </div>
                </div>

            </div>
        </JobSeekerAuth>
    )
}

export default Notification