
/**
 * 檢查PULI_UTILS是否存在
 */
if (typeof(PULI_UTILS) === "undefined") {
	PULI_UTILS = {};
}
 
if (typeof PULI_UTILS.post === "undefined") {
	PULI_UTILS.post = {};
}


$(function () {
    $("#srch_btn").click(function () {
        $("#masthead input.gsc-search-button").click();
    });
});

var menu_search_submit = function (_form) {
    var _query = _form.q.value;
    $("#masthead input.gsc-input").val(_query);
    $("#masthead input.gsc-search-button").click();
    return false;
};

var _disqus_embed = function () {
    var disqus_url = disqus_blogger_current_url;

    (function () {
        "use strict";
//        var get_comment_block = function () {
////            var block = document.getElementById('comments');
////            if (!block) {
////                block = document.getElementById('disqus-blogger-comment-block');
////            }
//            var block = document.getElementById('disqus-blogger-comment-block');
//            return block;
//        };
//        var comment_block = get_comment_block();
//        //alert(typeof(comment_block));
//        if (!!comment_block) {
//            
//            //var disqus_div = document.createElement('div');
//            //disqus_div.id = 'disqus_thread';
//            //comment_block.innerHTML = '';
//            //comment_block.appendChild(disqus_div);
//            //comment_block.style.display = 'block';
//            //var dsq = document.createElement('script');
//            //dsq.async = true;
//            var _src = '//' + disqus_shortname + '.disqus.com/embed.js';
//            //(document.getElementsByTagName('head')[0] || document.body).appendChild(dsq);
//            $.getScript('//' + disqus_shortname + '.disqus.com/embed.js');
//        }
        //var _src = '//' + disqus_shortname + '.disqus.com/embed.js';
        $.getScript('//' + disqus_shortname + '.disqus.com/embed.js');
    })();
};

//----------------------------------


/**
 * 記錄
 * 
 * @param {String} _title 標題
 * @param {String} _message 內文
 */
PULI_UTILS.log = function (_title, _message) {
	if (_message === undefined) {
		_message = _title;
		_title = null;
	}
	
	if (_title !== null) {
		_message = "[" + _title + "] " + _message;
	}
	
	_message = "[PULIPULI] " + _message;
	//console.trace(_message);
};
		
/**
 * 確認Blogger是否是全文網頁
 * @return {boolean}
 */
PULI_UTILS.is_blogger_fullpage = function()
{
	var href_array = location.href.split("/");
	//var href_array2 = location.href.split("\\");
	var _is_fulllpage = (href_array.length > 5 && href_array[4] != "label");
	var _is_file = href_array[0] != "file:";
	var _is_localhost = (href_array[2] == 'localhost');
	var _is_localhost_fullpage = (href_array[href_array.length-1] == 'fullpage.html');
	
	if (_is_localhost) {
		if (_is_localhost_fullpage) {
		return true;
	}
	else {
		return false;
	}
	}
	
	if (_is_fulllpage 
			&& _is_file) {
		//console.log('is_blogger_fullpage: true');
		return true;
	}
	else {
		//console.log('is_blogger_fullpage: false');
		return false;
	}
};

/**
 * 確認Blogger是否是全文網頁
 * @return {boolean}
 */
PULI_UTILS.is_guess_message = function()
{
	var _needle = "/2005/12/blogger_113544406852218769.html";
	var _href = location.href;
	return (_href.substr((_href.length - _needle.length), _needle.length ) === _needle);
};

/**
 * 建立獨一無二的ID
 * @return {integer}
 */
PULI_UTILS.create_id = function () {
    return (new Date()).getTime() + '';
};

var _page_index = 0;
PULI_UTILS.create_page_id = function () {
    var _pagename = location.pathname.split("/").slice(-1);
    if (typeof(_pagename[0]) === "string") {
        _pagename = _pagename[0];
    }
    _pagename = _pagename + _page_index;
    _page_index++;
    return _pagename;
};

// ----------------------------------
// 20160522 回到上一頁的功能：如果上一頁不是布丁布丁吃什麼，那就隱藏

var _header_back_button_click = function () {
    
    var _back_type = "back";
    
    if (typeof(document.referrer) !== "string") {
        _back_type = "index";
    }
    else {
        var _needle = [
            "http://blog.pulipuli.info/", 
            "http://pulipuli.info/", 
            "http://pulipuli.blogspot.com/", 
            "http://pulipuli.blogspot.tw/"
        ];

        var _result = false;
        for (var _i = 0; _i < _needle.length; _i++) {
            var _n = _needle[_i];
            if (document.referrer.substr(0, _n.length) === _n) {
                _result = true;
                break;
            }
        }
        
        if (_result === false) {
            _back_type = "index";
        }
    }
    
    if (_back_type === "back") {
        if (history.back() === undefined) {
            location.href = "/";
        }
    }
    else {
        location.href = "/";
    }
};

// ----------------------------------
// 20160522 Relate post的功能

var _display_related_posts = function (items, msgs, config) {
    var cursor = null;
      if (items && items.length > 0) {
        cursor = parseInt(items[items.length - 1].timestamp) + 1;
      }

      var bodyFromEntry = function(entry) {
        if (entry.gd$extendedProperty) {
          for (var k in entry.gd$extendedProperty) {
            if (entry.gd$extendedProperty[k].name === 'blogger.contentRemoved') {
              return '<span class="deleted-comment">' + entry.content.$t + '</span>';
            }
          }
        }
        return entry.content.$t;
      }

      var parse = function(data) {
        cursor = null;
        var comments = [];
        if (data && data.feed && data.feed.entry) {
          for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
            var comment = {};
            // comment ID, parsed out of the original id format
            var id = /blog-(\d+).post-(\d+)/.exec(entry.id.$t);
            comment.id = id ? id[2] : null;
            comment.body = bodyFromEntry(entry);
            comment.timestamp = Date.parse(entry.published.$t) + '';
            if (entry.author && entry.author.constructor === Array) {
              var auth = entry.author[0];
              if (auth) {
                comment.author = {
                  name: (auth.name ? auth.name.$t : undefined),
                  profileUrl: (auth.uri ? auth.uri.$t : undefined),
                  avatarUrl: (auth.gd$image ? auth.gd$image.src : undefined)
                };
              }
            }
            if (entry.link) {
              if (entry.link[2]) {
                comment.link = comment.permalink = entry.link[2].href;
              }
              if (entry.link[3]) {
                var pid = /.*comments\/default\/(\d+)\?.*/.exec(entry.link[3].href);
                if (pid && pid[1]) {
                  comment.parentId = pid[1];
                }
              }
            }
            comment.deleteclass = 'item-control blog-admin';
            if (entry.gd$extendedProperty) {
              for (var k in entry.gd$extendedProperty) {
                if (entry.gd$extendedProperty[k].name === 'blogger.itemClass') {
                  comment.deleteclass += ' ' + entry.gd$extendedProperty[k].value;
                }
              }
            }
            comments.push(comment);
          }
        }
        return comments;
      };

      var paginator = function(callback) {
        if (hasMore()) {
          var url = config.feed + '?alt=json&v=2&orderby=published&reverse=false&max-results=50';
          if (cursor) {
            url += '&published-min=' + new Date(cursor).toISOString();
          }
          window.bloggercomments = function(data) {
            var parsed = parse(data);
            cursor = parsed.length < 50 ? null
                : parseInt(parsed[parsed.length - 1].timestamp) + 1;
            callback(parsed);
            window.bloggercomments = null;
          };
          url += '&callback=bloggercomments';
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          document.getElementsByTagName('head')[0].appendChild(script);
        }
      };
      var hasMore = function() {
        return !!cursor;
      };
      var getMeta = function(key, comment) {
        if ('iswriter' === key) {
          var matches = !!comment.author
              && comment.author.name === config.authorName
              && comment.author.profileUrl === config.authorUrl;
          return matches ? 'true' : '';
        } else if ('deletelink' === key) {
          return config.baseUri + '/delete-comment.g?blogID='
               + config.blogId + '&postID=' + comment.id;
        } else if ('deleteclass' === key) {
          return comment.deleteclass;
        }
        return '';
      };

      var replybox = null;
      var replyUrlParts = null;
      var replyParent = undefined;

      var onReply = function(commentId, domId) {
        if (replybox === null) {
          // lazily cache replybox, and adjust to suit this style:
          replybox = document.getElementById('comment-editor');
          if (replybox !== null) {
            replybox.height = '210px';
            replybox.style.display = 'block';
            replyUrlParts = replybox.src.split('#');
          }
        }
        if (replybox && (commentId !== replyParent)) {
          document.getElementById(domId).insertBefore(replybox, null);
          replybox.src = replyUrlParts[0]
              + (commentId ? '&parentID=' + commentId : '')
              + '#' + replyUrlParts[1];
          replyParent = commentId;
        }
      };

      var hash = (window.location.hash || '#').substring(1);
      var startThread, targetComment;
      if (/^comment-form_/.test(hash)) {
        startThread = hash.substring('comment-form_'.length);
      } else if (/^c[0-9]+$/.test(hash)) {
        targetComment = hash.substring(1);
      }

      // Configure commenting API:
      var configJso = {
        'maxDepth': config.maxThreadDepth
      };
      var provider = {
        'id': config.postId,
        'data': items,
        'loadNext': paginator,
        'hasMore': hasMore,
        'getMeta': getMeta,
        'onReply': onReply,
        'rendered': true,
        'initComment': targetComment,
        'initReplyThread': startThread,
        'config': configJso,
        'messages': msgs
      };

      var render = function() {
        if (window.goog && window.goog.comments) {
          var holder = document.getElementById('comment-holder');
          window.goog.comments.render(holder, provider);
        }
      };

      // render now, or queue to render when library loads:
      if (window.goog && window.goog.comments) {
        render();
      } else {
        window.goog = window.goog || {};
        window.goog.comments = window.goog.comments || {};
        window.goog.comments.loadQueue = window.goog.comments.loadQueue || [];
        window.goog.comments.loadQueue.push(render);
      }
};

//---------------------------------------

$('.go-top').click(function(){$('.st-content').animate({scrollTop:0},'slow');$('html, body').animate({scrollTop:0},'slow');return false;});
