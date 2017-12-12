# Notes for the front end.

Notes for the front-end developers regarding the CiviDisc backend.

## User Object
---
  
The user will be available in every view, through the _user_ object.  

Check if a user is logged in:  
{{#if user}}

{{/if}}

You can display user specific data there:  

{{#if user}}
>_<_a href="/dashboard">Visit Dashboard!</a_>_  
>{{ upVotes }}  
>{{ downVotes }}  

{{/if}}  

## Layout Page  
---
The layout page has access to the user object, as well as notifications.  The notifications MUST be accessed through javascript.  There is an Ajax call in the 
public/assets/js/layout.js file that gets the notifications as json.  The next step would be looping through the response in order to build out the notifications window.  
Notifications via modal or a "hover" view effect would be preferred.

## Index route: '/'
---  
The home page is sent _posts_ ~~and _notifications_ (for the logged in user, if they are logged in)~~ (Notifications are sent to layout page) .  

~~The user may have no notifications.~~  _posts_ can be cycled through:

{{#each posts}}
>_<_a href="/posts/{{ id }}">{{ title }}</a_>_  
>{{ url }}    

{{/each}}

Posts returned to the '/' route will be top-level only (have no parents).  Each post should be selectable, and all children will be displayed from there.  
Each post should be displayed from a partial view in a consistent manner.
  

## viewPosts.handlebars  & Posts routes
---
This view is exposed by the /post/view/:id route.  This displays one post and the discussion that followed.

The viewPosts handlebars will display actual posts and children, rather than top-level posts.  An additional parameter: isClosed is being attached 
to the post object in the event that the post has exausted it's life.  All of the child posts are accessible throughs the children parameter _posts.children_. 

**IMPORTANT** - there is a reply-to route that only takes a comment.  I do think the title should automatically be "Reply to: _title of post we're responding to_" < this
functionality can be added on the server side.  

The reply route is: /api/posts/reply/:id << the reply comment should be in the request body.