/**
 * Create a new instance of the API client
 * @param [token] - user bearer token
 */
declare class SidechatAPIClient {
    constructor(token?: SidechatAuthToken);
    /**
     * User bearer token
     */
    userToken: SidechatAuthToken;
    /**
     * Default headers for every API request
     */
    defaultHeaders: any;
    /**
     * Manually set the currently signed in user's token.  Generally try to avoid this and instead either pass a token to the constructor or login automatically through the auth functions
     * @param token - user bearer token
     */
    setToken(token: SidechatAuthToken): void;
    /**
     * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
     * @param phoneNumber - US phone number (WITHOUT +1) to send verification code to
     */
    loginViaSMS(phoneNumber: number): void;
    /**
     * Verify the code sent via SMS with loginViaSMS().
     * @param phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
     * @param code - the verification code
     */
    verifySMSCode(phoneNumber: number, code: string): void;
    /**
     * Set the user's age
     * @param age - user's age in years
     * @param registrationID - the registration ID generated by verifySMSCode()
     */
    setAge(age: number, registrationID: string): void;
    /**
     * Initiate the email setup process.  Should be followed up with checkEmailVerification().
     * @param email - school email address to send verification code to
     */
    registerEmail(email: string): void;
    /**
     * Check is the user's email is verified.
     */
    checkEmailVerification(): void;
    /**
     * Set the device ID of the current user
     * @param deviceId - the device ID to set
     */
    setDeviceID(deviceId: string): void;
    /**
     * Get updated status for user and group
     * @param [groupID] - ID of a specific group to retrieve info from
     */
    getUserAndGroup(groupID?: string): void;
    /**
     * Fetches posts from the specified category in a group
     * @param groupID - group ID
     * @param category - category to filter posts
     * @param [cursor] - cursor string
     * @returns List of posts and cursor
     */
    getGroupPosts(groupID: string, category: "hot" | "recent" | "top", cursor?: SidechatCursorString): SidechatPostsAndCursor;
    /**
     * Upvote or downvote, or unvote a post
     * @param postID - post ID to vote on
     * @param action - whether to upvote, downvote, or reset vote
     */
    setVote(postID: string, action: SidechatVoteString): void;
    /**
     * Get all the commments on a post
     * @param postID - post ID to get comments for
     * @returns list of comments
     */
    getPostComments(postID: string): SidechatPostOrComment[];
    /**
     * Gets groups to be displayed on the "Explore Groups" page
     */
    getAvailableGroups(): SidechatGroup[];
}

/**
 * Throwable error caused by the Sidechat API
 */
declare class SidechatAPIError extends Error {
}

/**
 * A user-created post or comment, depending on the "type" prop
 * @property type - whether this object represents a post or a comment on a post
 * @property id - alphanumeric ID of post or comment
 * @property authored_by_user - undocumented
 * @property alias - post creator's name in-app
 * @property group_id - alphanumeric ID of group
 * @property group - group in which post or comment was created
 * @property text - text content of post or comment
 * @property created_at - date string of post or comment creation time
 * @property vote_total - sum of upvotes and downvotes
 * @property vote_status - current user's vote on post or comment
 * @property assets - array of assets attached to post or comment
 * @property attachments - undocumented
 * @property dms_disabled - whether or not you can send a DM to creator of post
 * @property tags - undocumented
 * @property identity - creator's identity information
 * @property pinned - undocumented
 * @property is_saved - undocumented
 * @property follow_status - undocumented
 * @property [destination] - undocumented
 * @property [comment_count] - number of comments on post (only if type=post)
 * @property [comments_disabled] - whether or not you can comment on post (only if type=post)
 * @property [parent_post_id] - alphanumeric ID of parent post (only if type=comment)
 * @property [reply_post_id] - alphanumeric ID of comment being replied to, falls back to parent_post_id (only if type=comment)
 * @property [context] - text content of comment being replied to, falls back to text (only if type=comment)
 */
declare type SidechatPostOrComment = {
    type: "post" | "comment";
    id: string;
    authored_by_user: boolean;
    alias: string;
    group_id: string;
    group: SidechatGroup;
    text: string;
    created_at: string;
    vote_total: number;
    vote_status: SidechatVoteString;
    assets: SidechatAsset[];
    attachments: any[];
    dms_disabled: boolean;
    tags: any[];
    identity: SidechatIdentity;
    pinned: boolean;
    is_saved: boolean;
    follow_status: "following" | "not_following";
    destination?: "group";
    comment_count?: number;
    comments_disabled?: boolean;
    parent_post_id?: string;
    reply_post_id?: string;
    context?: string;
};

/**
 * A group object, containing metadata about a group as well as its join conditions and states
 * @property id - alphanumeric ID of group
 * @property name - human-readable name of group
 * @property analytics_name - name to file group under
 * @property membership_type - whether or not current user is a member of group
 * @property color - group's theme color as hex code (e.g., #FFFFFF)
 * @property group_join_type - basis on which group accepts new members
 * @property group_visibility - group's visibility setting
 * @property asset_library_visibility - whether or not group's asset library is visible
 * @property [roles] - undocumented
 * @property [description] - description of group
 * @property [icon_url] - image URL for group icon
 * @property [member_count] - number of users in group
 * @property [should_show_leaderboard] - undocumented
 */
declare type SidechatGroup = {
    id: string;
    name: string;
    analytics_name: string;
    membership_type: "non_member" | "member";
    color: string;
    group_join_type: "open" | "closed" | "email_domain";
    group_visibility: "private" | "public_to_all" | "public_to_schools";
    asset_library_visibility: "show" | "hide";
    roles?: any[];
    description?: string;
    icon_url?: SidechatPrivateAssetURL;
    member_count?: number;
    should_show_leaderboard?: boolean;
};

/**
 * An asset object, containing information about an image within a post or comment
 * @property id - alphanumeric ID of asset
 * @property type - undocumented
 * @property content_type - file type of asset
 * @property width - the width of asset
 * @property height - the height of asset
 * @property url - URL string of asset's location
 */
declare type SidechatAsset = {
    id: string;
    type: "image";
    content_type: "jpeg" | "png" | "gif";
    width: number;
    height: number;
    url: SidechatPrivateAssetURL;
};

/**
 * A user's identity information
 * @property name - representation of user's name (varies across app)
 * @property posted_with_username - undocumented
 */
declare type SidechatIdentity = {
    name: string;
    posted_with_username: boolean;
};

/**
 * An asset URL that can only be accessed by making a request with a user's bearer token attached in the Authorization header
 */
declare type SidechatPrivateAssetURL = string;

/**
 * A cursor for paginating through post lists
 */
declare type SidechatCursorString = string;

/**
 * A vote on a comment or post
 */
declare type SidechatVoteString = "upvote" | "downvote" | "none";

/**
 * A user's bearer authentication token needed for most requests
 */
declare type SidechatAuthToken = string;

/**
 * A list of posts and the associated cursor
 */
declare type SidechatPostsAndCursor = {
    posts: SidechatPostOrComment[];
    cursor: SidechatCursorString;
};
