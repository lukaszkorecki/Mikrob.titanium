var Update = new Class.create({
	initialize : function(obj)	{
		this.id = obj.id;
		this.user = obj.user;
		this.body = this.parseBody(obj.body);
		this.created_at = obj.created_at;

	},
	
	print : function() {
		var temp = new Template("<div class='update'><p><img src='#{avatar} ' /> ^#{login} #{id} #{created_at}</p><p>#{body}</p></div>");
		var self = this;
		var ob = {
			body : self.body,
			login : self.user.login,
			avatar : "http://blip.pl" +self.user.avatar.url_30,
			created_at : self.created_at,
			id : self.id
		};
		return temp.evaluate(ob);
	},

	parseBody : function(body) {
        function formatBlipZnaczki(body) {
            return body.replace(/[☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]/gi, "<span class=\"big\">$&</span>");
        }
        function formatLinks(txt) {
            var findLinks = /http:\/\/\S+/gi;
            return txt.replace(findLinks, '<a class="externalLink" target="_blank" href="$&" title="$&">$&</a>');
        }
        function formatUsers(txt) {
            var findUsers = /\^([\w]{1,})/gi;
            return txt.replace(findUsers, '<a class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">^</span>$1</a>');
        }
        function formatUsersTwitter(txt) {
            var findUsers = /\@([\w]{1,})/gi;
            return txt.replace(findUsers, '<a class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">@</span>$1</a>');
        }
        function formatTags(txt) {
            var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓…∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]*/gi;
            return txt.replace(findTags, '<a class="externalLink tagLink" title="$&" href="http://blip.pl/tags/$&">$&</a>');
        }
        body = body.replace('&', '&amp;');
        body = body.replace(/\>/gi, '&gt;');
        body = body.replace(/\</gi, '&lt;');

        var text2 = formatBlipZnaczki(body);
        var text1 = formatLinks(text2);
        text2 = formatTags(text1).replace(/\/#/g, '/');
        text1 = formatUsers(text2).replace(/\/\^/g, '/');
        text2 = formatUsersTwitter(text1).replace(/\/\@/g, '/');
		text1 = text2;

        return text1;
		}
});
