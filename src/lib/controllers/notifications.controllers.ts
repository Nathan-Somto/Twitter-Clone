import mongoose from "mongoose";
import Notification from "../models/notification.models";
/**
 * @method GET
 * @route /api/users/:userId/notifications
 * @description gets all the user notifications.
 */
const get_user_notifications = async (userId: mongoose.Types.ObjectId) => {
  try {
    // find all the notifications that the parent user is set to the userId
    const userNotifications = await Notification.find({
      parentUser: userId,
    }).populate("actionUser", "username profilImgUrl");
    // if nothing return an empty array
    return {
      status: "success",
      notifications: userNotifications,
      message: "all the notifications for the user.",
      userId,
    };
    // return as per usual.
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
      }
      return {
        status: 'failed',
        message: "failed to fetch any notifications."
      }
  }
};

/**
 * @method GET
 * @route /api/users/:userId/notifications
 * @description returns the length of unread notifications.
 */
const get_unread_notifications = async (userId: mongoose.Types.ObjectId) => {
  try {
    // finds all the user notifications that userId is set to parent User and read status is false.
    // counts all the documents.
    const numberOfUnreadNotifications = await Notification.countDocuments({
      parentUser: userId,
      read: false,
    });
    return {
      status: "success",
      numberOfUnreadNotifications,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return {
      status: "failed",
      message: "failed to get unread notifications.",
    };
  }
};
/**
 * @method PUT
 * @route /api/users/:userId/notifications
 * @description  updates all unread notifications  read status to true.
 */
const read_user_notifications = async (userId: mongoose.Types.ObjectId) => {
  try {
    // update all the user notifications read status to true  if parent user is set to userId and read is false
    const notifications = await Notification.updateMany(
      { parentUser: userId, read: false },
      { $set: [{ read: true }] }
    );
    if (!notifications.acknowledged) {
      return {
        status: "failed",
        message: "failed to read all unread notifications.",
      };
    }
    return {
      status: "success",
      message: "successfully read alll unread notifications.",
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return {
      status: "failed",
      message: "failed to read all unread notifications.",
    };
  }
};
/**
 * @method DELETE
 * @route /api/users/:userId/notifications/:notificationId
 * @description deletes one notification for a user.
 */
const delete_user_notification = async (
  userId: mongoose.Types.ObjectId,
  notificationId: mongoose.Types.ObjectId
) => {
  // find and delete the notification based on it's id.
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (notification === null) {
      return {
        status: "failed",
        message: "failed to find and delete the given notification.",
      };
    }
    return {
      status: "success",
      message: "deleted the given notification",
      notificationId,
      notification,
      userId,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return {
      status: "failed",
      message: "failed to find and delete the given notification.",
    };
  }
};
/**
 * @method DELETE
 * @route /api/users/:userId/notifications
 * @description deletes all the user's notifications.
 */
const delete_all_user_notifications = async (
  userId: mongoose.Types.ObjectId
) => {
  // find and delete all notifications that parentUser matches user
  try {
    const notifications = await Notification.deleteMany({ parentUser: userId });
    if (!notifications.acknowledged) {
      return {
        status: "failed",
        message:
          "failed to delete all user notifications, maybe you should check the id.",
      };
    }
    return {
      status: "success",
      message: "successfully deleted all user notifications.",
      numberOfNotificationsDeleted: notifications.deletedCount,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return {
      status: "failed",
      message: "failed to delete all user notifications.",
    };
  }
};
export {
  get_user_notifications,
  get_unread_notifications,
  read_user_notifications,
  delete_user_notification,
  delete_all_user_notifications,
};
