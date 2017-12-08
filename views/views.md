# Notes for the front end.

Notes for the front-end developers regarding the CiviDisc backend.
---
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
---
## Index route: '/'
---  
The home page is sent _posts_ and _notifications_ (for the logged in user, if they are logged in).  

The user may have no notifications.  _posts_ can be cycled through:

{{#each posts}}
>_<_a href="/posts/{{ id }}">{{ title }}</a_>_  
>{{ url }}    

{{/each}}

Posts returned to the '/' route will be top-level only (have no parents).  Each post should be selectable, and all children will be displayed from there.  
Each post should be displayed from a partial view in a consistent manner.
  

