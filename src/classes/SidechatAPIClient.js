import "../types/SidechatTypes.js";
import SidechatAPIError from "../classes/SidechatAPIError.js";

/**
 * API client class for making requests to Sidechat's private API.  You'll need to [authenticate]{@tutorial Authentication} before using most of the methods.
 * @class
 * @since 2.0.0-alpha.0
 */
class SidechatAPIClient {
  /**
   * User bearer token
   * @type {SidechatAuthToken}
   * */
  userToken;
  /**
   * Default headers for every API request
   * @type {Object}
   * @static
   * @constant
   */
  defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "App-Version": "10.0.0",
    Dnt: "1",
  };

  /**
   * Create a new instance of the API client
   * @param {SidechatAuthToken} [token] - user bearer token
   */
  constructor(token = "") {
    if (token) {
      this.userToken = token;
    }
  }

  /**
   * Manually set the currently signed in user's token.  Generally try to avoid this and instead either pass a token to the constructor or login automatically through the auth functions
   * @method
   * @param {SidechatAuthToken} token - user bearer token
   */
  setToken = (token) => {
    this.userToken = token;
  };

  /**
   * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
   */
  loginViaSMS = async (phoneNumber) => {
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/login_register`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({
          phone_number: `+1${phoneNumber}`,
          version: 3,
        }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed to request SMS verification.");
    }
  };

  /**
   * Verify the code sent via SMS with loginViaSMS().  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
   * @param {String} code  - the verification code
   */
  verifySMSCode = async (phoneNumber, code) => {
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/verify_phone_number`,
        {
          method: "POST",
          headers: this.defaultHeaders,
          body: JSON.stringify({
            phone_number: `+1${phoneNumber}`,
            code: code.toUpperCase(),
          }),
        }
      );
      const json = await res.json();
      if (json?.logged_in_user?.token) {
        this.userToken = json.logged_in_user.token;
      }
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
  };

  /**
   * Set the user's age.  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} age - user's age in years
   * @param {String} registrationID  - the registration ID generated by verifySMSCode()
   */
  setAge = async (age, registrationID) => {
    if (age < 13) {
      throw new SidechatAPIError("You're too young to use Offsides.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/complete_registration`,
        {
          method: "POST",
          headers: this.defaultHeaders,
          body: JSON.stringify({
            age: Number(age),
            registration_id: registrationID,
          }),
        }
      );
      const json = await res.json();
      if (json.token) {
        this.userToken = json.token;
      }
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
  };

  /**
   * Initiate the email setup process.  Should be followed up with checkEmailVerification().
   * @method
   * @since 1.0.0
   * @param {String} email - school email address to send verification code to
   * @tutorial Email Registration
   */
  registerEmail = async (email) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v2/users/register_email`,
        {
          method: "POST",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      const json = await res.json();
      if (json.message) {
        throw new SidechatAPIError(json.message);
      }
      return json;
    } catch (err) {
      console.error(error);
      throw new SidechatAPIError("Failed to request email verification.");
    }
  };

  /**
   * Check is the user's email is verified.
   * @method
   * @since 1.0.0
   */
  checkEmailVerification = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/users/check_email_verified`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const json = await res.json();
      if (json.verified_email_updates_response) {
        return json.verified_email_updates_response;
      } else {
        throw new SidechatAPIError(json?.message || "Email is not verified.");
      }
    } catch (err) {
      console.error(error);
      throw new SidechatAPIError("Email is not verified.");
    }
  };

  /**
   * Set the device ID of the current user
   * @method
   * @since 1.0.0
   * @param {String} deviceId - the device ID to set
   */
  setDeviceID = async (deviceID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/register_device_token`,
        {
          method: "POST",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
          body: JSON.stringify({
            build_type: "release",
            bundle_id: "com.flowerave.sidechat",
            device_token: deviceID,
          }),
        }
      );
      const json = await res.json();
      await AsyncStorage.setItem("deviceID", deviceID);
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
  };

  /**
   * Get updated status for user and group
   * @method
   * @since 1.0.0
   * @deprecated since 2.1.0, will be removed by 3.0.0.  Please use `getUpdates` instead!
   * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
   */
  getUserAndGroup = async (groupID = "") => {
    const json = await this.getUpdates(groupID);
    return json;
  };

  /**
   * Get updated status for user and group
   * @method
   * @since 2.1.0
   * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
   */
  getUpdates = async (groupID = "") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/updates?group_id=${groupID}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get posts from group.`);
    }
  };

  /**
   * Fetches posts from the specified category in a group
   * @method
   * @since 1.0.0
   * @param {String} groupID - group ID
   * @param {"hot"|"recent"|"top"} category - category to filter posts
   * @param {SidechatCursorString} [cursor] - cursor string
   * @returns {SidechatPostsAndCursor} List of posts and cursor
   */
  getGroupPosts = async (groupID, category = "hot", cursor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/posts?group_id=${groupID}&type=${category}${
          cursor ? "&cursor=" + cursor : ""
        }`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get posts from group.`);
    }
  };

  /**
   * Upvote or downvote, or unvote a post
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to vote on
   * @param {SidechatVoteString} action - whether to upvote, downvote, or reset vote
   */
  setVote = async (postID, action) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/posts/set_vote`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          post_id: postID,
          vote_status: action,
        }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to change the vote on post.`);
    }
  };

  /**
   * Get all the commments on a post
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to get comments for
   * @returns {SidechatPostOrComment[]} list of comments
   */
  getPostComments = async (postID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `https://api.sidechat.lol/v1/posts/comments/?post_id=${postID}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const json = await res.json();
      // Function to preprocess the comments and organize them into a nested structure
      function preprocessComments(apiComments) {
        // Map to store comments by their IDs for efficient lookup
        const commentMap = new Map();
        // List to store top-level comments
        const topLevelComments = [];

        // Iterate through the API comments
        apiComments.forEach((comment) => {
          // Store the comment in the map with its ID as the key
          commentMap.set(comment.id, comment);
          // Get the parent comment using the reply_post_id
          const parentComment = commentMap.get(comment.reply_post_id);
          // Check if the comment is a top-level comment
          if (
            !parentComment ||
            comment.reply_post_id === comment.parent_post_id
          ) {
            // If it's a top-level comment, push it to the topLevelComments array
            topLevelComments.push(comment);
          } else {
            // If it's a reply, add it to the parent comment's replies array
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(comment);
          }
        });

        // Flatten the nested structure and return a single list of comments
        return flattenComments(topLevelComments);
      }

      // Function to flatten nested comments into a single list
      function flattenComments(comments) {
        // Use reduce to flatten the nested comments array into a single list
        return comments.reduce((flatComments, comment) => {
          // Push the current comment to the flatComments array
          flatComments.push(comment);
          // If the current comment has replies, recursively flatten them and push to the flatComments array
          if (comment.replies)
            flatComments.push(...flattenComments(comment.replies));
          // Return the flatComments array
          return flatComments;
        }, []);
      }

      const sortedComments = preprocessComments(json.posts);
      return sortedComments;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get comments on post.`);
    }
  };

  /**
   * Gets groups to be displayed on the "Explore Groups" page
   * @method
   * @since 2.0.0-alpha.0
   * @returns {SidechatGroup[]}
   */
  getAvailableGroups = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/groups/explore`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.userToken}`,
          Dnt: "1",
        },
      });
      const json = await res.json();
      return await json.groups;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groups from explore.`);
    }
  };

  /**
   * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
   * @method
   * @since 2.0.6
   * @returns {SidechatLibraryAsset[]}
   */
  getAssetLibrary = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/assets/library`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.items;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get asset library.`);
    }
  };

  /**
   * Gets the current authenticated user and a list of the groups of which they are members.
   * @method
   * @since 2.1.0
   * @returns {SidechatCurrentUser}
   */
  getCurrentUser = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/users/me`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get asset library.`);
    }
  };

  /**
   * Gets the metadata of a group from its ID
   * @method
   * @since 2.1.0
   * @param {String} [groupID] - alphanumeric ID of a group to get.  Falls back to user's primary group.
   * @returns {SidechatGroup}
   */
  getGroupMetadata = async (groupID = "") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/groups/${groupID}`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.group;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get group metadata.`);
    }
  };

  /**
   * Creates a comment on a post
   * @method
   * @since 2.2.0
   * @param {String} parentPostID - alphanumeric ID of post on which this comment is made
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {String} [replyCommentID] - alphanumeric ID of comment to reply to.  Falls back to parentPostID
   * @param {SidechatSimpleAsset[]} [assetList] - list of assets to attach
   * @param {Boolean} [disableDMs] - prevent direct messages being sent to comment's author
   * @returns {SidechatPostOrComment} created comment
   */
  createComment = async (
    parentPostID,
    text,
    groupID,
    replyCommentID = parentPostID,
    assetList = [],
    disableDMs = false
  ) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const data = JSON.stringify({
        type: "comment",
        assets: assetList,
        group_ids: [groupID],
        text: text,
        reply_post_id: replyCommentID,
        parent_post_id: parentPostID,
        dms_disabled: disableDMs,
      });
      const res = await fetch(`https://api.sidechat.lol/v1/posts`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
          "Content-Length": data.length,
        },
        body: data,
      });
      const json = await res.json();
      return await json.comment;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to post comment.`);
    }
  };

  /**
   * Creates a new post in the specified group
   * @method
   * @since 2.2.0
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {SidechatSimpleAsset[]} [assetList] - list of assets to attach.
   * @param {Boolean} [disableDMs] - prevent direct messages from being sent to post's author
   * @param {Boolean} [disableComments] - whether or not comments should be disabled on post
   * @returns {SidechatPostOrComment} the created post
   */
  createPost = async (
    text,
    groupID,
    assetList = [],
    disableDMs = false,
    disableComments = false
  ) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const data = JSON.stringify({
        type: "post",
        assets: assetList,
        group_ids: [groupID],
        text: text,
        attachments: [],
        dms_disabled: disableDMs,
        comments_disabled: disableComments,
      });
      const res = await fetch(`https://api.sidechat.lol/v1/posts`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
          "Content-Length": data.length,
        },
        body: data,
      });
      const json = await res.json();
      return await json.posts[0];
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to make post.`);
    }
  };

  /**
   * Deletes a post or comment that the user created
   * @method
   * @since 2.2.0
   * @param {String} postOrCommentID - alphanumeric ID of post to delete
   */
  deletePostOrComment = async (postOrCommentID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/posts/delete`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          post_id: postOrCommentID,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to delete post.`);
    }
  };

  /**
   * Sets the conversation icon of the current user
   * @method
   * @since 2.2.1
   * @param {String} userID - alphanumeric ID of the post to delete
   * @param {String} emoji - emoji to set as icon
   * @param {String} primaryColor - hex string (including #) of primary color
   * @param {String} secondaryColor - hex string (including #) of secondary color
   */
  setUserIcon = async (userID, emoji, primaryColor, secondaryColor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`https://api.sidechat.lol/v1/users/${userID}`, {
        method: "PATCH",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          conversation_icon: {
            emoji: emoji,
            secondary_color: secondaryColor,
            is_migrated: true,
            color: primaryColor,
          },
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set icon.`);
    }
  };
}

export default SidechatAPIClient;
