import "../types/SidechatTypes.js";
import SidechatAPIError from "../classes/SidechatAPIError.js";

/**
 * API client class for making requests to Sidechat's private API.  As of now all methods are static.
 * @class
 * @since 2.0.0-alpha.0
 * @todo Add functionality for constructing a client with or without a token and having it keep track of requests/caching, etc
 */
class SidechatAPIClient {
  /** User bearer token */
  userToken;
  /** Default headers for every API request */
  defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
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
   * Verify the code sent via SMS with loginViaSMS().
   * @method
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
   * Set the user's age
   * @method
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
   * @param {String} email - school email address to send verification code to
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
   * @param {String} [groupID] - ID of a specific group to retrieve info from
   */
  getUserAndGroup = async (groupID = "") => {
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
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.groups;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groups from explore.`);
    }
  };
}

export default SidechatAPIClient;
