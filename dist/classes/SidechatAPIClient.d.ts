export default SidechatAPIClient;
/**
 * API client class for making requests to Sidechat's private API.  You'll need to [authenticate]{@tutorial Authentication} before using most of the methods.
 * @class
 * @since 2.0.0-alpha.0
 */
declare class SidechatAPIClient {
    /**
     * Create a new instance of the API client
     * @param {SidechatAuthToken} [token] - user bearer token
     */
    constructor(token?: SidechatAuthToken);
    /**
     * User bearer token
     * @type {SidechatAuthToken}
     * */
    userToken: SidechatAuthToken;
    /**
     * Default headers for every API request
     * @type {Object}
     * @static
     * @constant
     */
    defaultHeaders: any;
    /**
     * Manually set the currently signed in user's token.  Generally try to avoid this and instead either pass a token to the constructor or login automatically through the auth functions
     * @method
     * @param {SidechatAuthToken} token - user bearer token
     */
    setToken: (token: SidechatAuthToken) => void;
    /**
     * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
     * @method
     * @since 1.0.0
     * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
     */
    loginViaSMS: (phoneNumber: number) => Promise<any>;
    /**
     * Verify the code sent via SMS with loginViaSMS().  If this function succeeds, the user will be authenticated for future requests.
     * @method
     * @since 1.0.0
     * @param {Number} phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
     * @param {String} code  - the verification code
     */
    verifySMSCode: (phoneNumber: number, code: string) => Promise<any>;
    /**
     * Set the user's age.  If this function succeeds, the user will be authenticated for future requests.
     * @method
     * @since 1.0.0
     * @param {Number} age - user's age in years
     * @param {String} registrationID  - the registration ID generated by verifySMSCode()
     */
    setAge: (age: number, registrationID: string) => Promise<any>;
    /**
     * Initiate the email setup process.  Should be followed up with checkEmailVerification().
     * @method
     * @since 1.0.0
     * @param {String} email - school email address to send verification code to
     * @tutorial Email Registration
     */
    registerEmail: (email: string) => Promise<any>;
    /**
     * Check is the user's email is verified.
     * @method
     * @since 1.0.0
     */
    checkEmailVerification: () => Promise<any>;
    /**
     * Set the device ID of the current user
     * @method
     * @since 1.0.0
     * @param {String} deviceId - the device ID to set
     */
    setDeviceID: (deviceID: any) => Promise<any>;
    /**
     * Get updated status for user and group
     * @method
     * @since 1.0.0
     * @deprecated since 2.1.0, will be removed by 3.0.0.  Please use `getUpdates` instead!
     * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
     */
    getUserAndGroup: (groupID?: string) => Promise<any>;
    /**
     * Get updated status for user and group
     * @method
     * @since 2.1.0
     * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
     */
    getUpdates: (groupID?: string) => Promise<any>;
    /**
     * Fetches posts from the specified category in a group
     * @method
     * @since 1.0.0
     * @param {String} groupID - group ID
     * @param {"hot"|"recent"|"top"} category - category to filter posts
     * @param {SidechatCursorString} [cursor] - cursor string
     * @returns {SidechatPostsAndCursor} List of posts and cursor
     */
    getGroupPosts: (groupID: string, category?: "hot" | "recent" | "top", cursor?: SidechatCursorString) => SidechatPostsAndCursor;
    /**
     * Upvote or downvote, or unvote a post
     * @method
     * @since 2.0.0-alpha.0
     * @param {String} postID - post ID to vote on
     * @param {SidechatVoteString} action - whether to upvote, downvote, or reset vote
     */
    setVote: (postID: string, action: SidechatVoteString) => Promise<any>;
    /**
     * Fetches a single post with just its ID
     * @method
     * @since 2.3.0
     * @param {String} postID - ID of post to fetch
     * @param {Boolean} includeDeleted - undocumented
     * @returns {SidechatPostOrComment} post object
     */
    getPost: (postID: string, includeDeleted?: boolean) => SidechatPostOrComment;
    /**
     * Fetches the posts or comments that the user has created
     * @method
     * @since 2.3.5
     * @param {"posts"|"comments"} contentType - type of user content to fetch
     * @returns {SidechatPostOrComment[]} post object
     */
    getUserContent: (contentType: "posts" | "comments") => SidechatPostOrComment[];
    /**
     * Get all the commments on a post
     * @method
     * @since 2.0.0-alpha.0
     * @param {String} postID - post ID to get comments for
     * @returns {SidechatPostOrComment[]} list of comments
     */
    getPostComments: (postID: string) => SidechatPostOrComment[];
    /**
     * Gets groups to be displayed on the "Explore Groups" page
     * @method
     * @since 2.0.0-alpha.0
     * @param {Boolean} onePage - whether or not results should be returned as a single page
     * @returns {SidechatGroup[]}
     */
    getAvailableGroups: (onePage?: boolean) => SidechatGroup[];
    /**
     * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
     * @method
     * @since 2.0.6
     * @returns {SidechatLibraryAsset[]}
     */
    getAssetLibrary: () => SidechatLibraryAsset[];
    /**
     * Gets the current authenticated user and a list of the groups of which they are members.
     * @method
     * @since 2.1.0
     * @returns {SidechatCurrentUser}
     */
    getCurrentUser: () => SidechatCurrentUser;
    /**
     * Gets the metadata of a group from its ID
     * @method
     * @since 2.1.0
     * @param {String} [groupID] - alphanumeric ID of a group to get.  Falls back to user's primary group.
     * @returns {SidechatGroup}
     */
    getGroupMetadata: (groupID?: string) => SidechatGroup;
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
    createComment: (parentPostID: string, text: string, groupID: string, replyCommentID?: string, assetList?: SidechatSimpleAsset[], disableDMs?: boolean) => SidechatPostOrComment;
    /**
     * Creates a new post in the specified group
     * @method
     * @since 2.2.0
     * @param {String} text - text content of comment
     * @param {String} groupID - alphanumeric ID of group in which the parent post resides
     * @param {SidechatSimpleAsset[]} [assetList] - list of assets to attach.
     * @param {Boolean} [disableDMs] - prevent direct messages from being sent to post's author
     * @param {Boolean} [disableComments] - whether or not comments should be disabled on post
     * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on post
     * @returns {SidechatPostOrComment} the created post
     */
    createPost: (text: string, groupID: string, assetList?: SidechatSimpleAsset[], disableDMs?: boolean, disableComments?: boolean, anonymous?: boolean) => SidechatPostOrComment;
    /**
     * Deletes a post or comment that the user created
     * @method
     * @since 2.2.0
     * @param {String} postOrCommentID - alphanumeric ID of post to delete
     */
    deletePostOrComment: (postOrCommentID: string) => Promise<any>;
    /**
     * Sets the conversation icon of the current user
     * @method
     * @since 2.2.1
     * @param {String} userID - alphanumeric ID of user
     * @param {String} emoji - emoji to set as icon
     * @param {String} primaryColor - hex string (including #) of primary color
     * @param {String} secondaryColor - hex string (including #) of secondary color
     */
    setUserIcon: (userID: string, emoji: string, primaryColor: string, secondaryColor: string) => Promise<any>;
    /**
     * Checks if user can set their username to a string
     * @method
     * @since 2.3.6
     * @param {String} username - string to check
     * @returns {Boolean} whether or not username is valid and unused
     */
    checkUsername: (username: string) => boolean;
    /**
     * Changes the username of the current user
     * @method
     * @since 2.3.6
     * @param {String} userID - alphanumeric ID of user
     * @param {String} username - new username to set
     */
    setUsername: (userID: string, username: string) => Promise<any>;
    /**
     * Marks an activity item as read
     * @method
     * @since 2.3.2
     * @param {String} activityID - alphanumeric ID of activity object
     */
    readActivity: (activityID: string) => Promise<any>;
    /**
     * Retrieves joinable group chats
     * @method
     * @since 2.3.5
     */
    getGroupChats: () => Promise<any>;
    /**
     * Joins a group chat
     * @method
     * @since 2.3.5
     */
    joinGroupChat: (groupChatID: any, displayName: any, emoji: any, primaryColor: any, secondaryColor: any) => Promise<any>;
}
//# sourceMappingURL=SidechatAPIClient.d.ts.map