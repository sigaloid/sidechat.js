/**
 * A user-created post or comment, depending on the "type" prop
 */
type SidechatPostOrComment = {
    /**
     * - whether this object represents a post or a comment on a post
     */
    type: "post" | "comment";
    /**
     * - alphanumeric ID of post or comment
     */
    id: string;
    /**
     * - undocumented
     */
    authored_by_user: boolean;
    /**
     * - post creator's name in-app
     */
    alias: string;
    /**
     * - alphanumeric ID of group
     */
    group_id: string;
    /**
     * - group in which post or comment was created
     */
    group: SidechatGroup;
    /**
     * - text content of post or comment
     */
    text: string;
    /**
     * - date string of post or comment creation time
     */
    created_at: string;
    /**
     * - sum of upvotes and downvotes
     */
    vote_total: number;
    /**
     * - current user's vote on post or comment
     */
    vote_status: SidechatVoteString;
    /**
     * - array of assets attached to post or comment
     */
    assets: SidechatAsset[];
    /**
     * - undocumented
     */
    attachments: any[];
    /**
     * - whether or not you can send a DM to creator of post
     */
    dms_disabled: boolean;
    /**
     * - undocumented
     */
    tags: any[];
    /**
     * - creator's identity information
     */
    identity: SidechatIdentity;
    /**
     * - undocumented
     */
    pinned: boolean;
    /**
     * - undocumented
     */
    is_saved: boolean;
    /**
     * - undocumented
     */
    follow_status: "following" | "not_following";
    /**
     * - undocumented
     */
    destination?: "group";
    /**
     * - number of comments on post (only if type=post)
     */
    comment_count?: number;
    /**
     * - whether or not you can comment on post (only if type=post)
     */
    comments_disabled?: boolean;
    /**
     * - alphanumeric ID of parent post (only if type=comment)
     */
    parent_post_id?: string;
    /**
     * - alphanumeric ID of comment being replied to, falls back to parent_post_id (only if type=comment)
     */
    reply_post_id?: string;
    /**
     * - text content of comment being replied to, falls back to text (only if type=comment)
     */
    context?: string;
};
/**
 * A group object, containing metadata about a group as well as its join conditions and states
 */
type SidechatGroup = {
    /**
     * - alphanumeric ID of group
     */
    id: string;
    /**
     * - human-readable name of group
     */
    name: string;
    /**
     * - name to file group under
     */
    analytics_name: string;
    /**
     * - whether or not current user is a member of group
     */
    membership_type: "non_member" | "member";
    /**
     * -  group's theme color as hex code (e.g., #FFFFFF)
     */
    color: string;
    /**
     * - basis on which group accepts new members
     */
    group_join_type: "open" | "closed" | "email_domain";
    /**
     * - group's visibility setting
     */
    group_visibility: "private" | "public_to_all" | "public_to_schools";
    /**
     * - whether or not group's asset library is visible
     */
    asset_library_visibility: "show" | "hide";
    /**
     * - undocumented
     */
    roles?: any[];
    /**
     * - description of group
     */
    description?: string;
    /**
     * - image URL for group icon
     */
    icon_url?: SidechatPrivateAssetURL;
    /**
     * - number of users in group
     */
    member_count?: number;
    /**
     * - undocumented
     */
    should_show_leaderboard?: boolean;
};
/**
 * An asset object, containing information about an image within a post or comment
 */
type SidechatAsset = {
    /**
     * - alphanumeric ID of asset
     */
    id: string;
    /**
     * - undocumented
     */
    type: "image";
    /**
     * - file type of asset
     */
    content_type: "jpeg" | "png" | "gif";
    /**
     * - the width of asset
     */
    width: number;
    /**
     * - the height of asset
     */
    height: number;
    /**
     * - URL string of asset's location
     */
    url: SidechatPrivateAssetURL;
};
/**
 * A user's identity information
 */
type SidechatIdentity = {
    /**
     * - representation of user's name (varies across app)
     */
    name: string;
    /**
     * - undocumented
     */
    posted_with_username: boolean;
};
/**
 * An asset URL that can only be accessed by making a request with a user's bearer token attached in the Authorization header
 */
type SidechatPrivateAssetURL = string;
/**
 * A cursor for paginating through post lists
 */
type SidechatCursorString = string;
/**
 * A vote on a comment or post
 */
type SidechatVoteString = "upvote" | "downvote" | "none";
/**
 * A user's bearer authentication token needed for most requests
 */
type SidechatAuthToken = string;
/**
 * A list of posts and the associated cursor
 */
type SidechatPostsAndCursor = {
    posts: SidechatPostOrComment[];
    cursor: SidechatCursorString;
};
//# sourceMappingURL=SidechatTypes.d.ts.map