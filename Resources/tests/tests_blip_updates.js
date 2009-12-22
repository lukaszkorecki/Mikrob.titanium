var BlipUpdatesTest = Evidence.TestCase.extend("BlipUpdatesTest",{
	setUp : function() {
		this.s =  {
			"type":"Status",
			"transport":{  "name":"api",  "id":7       },
			"body":"Wydano Kadu 0.6.6 alpha0 z obs\u0142ug\u0105 Jabber/XMPP! http://rdir.pl/2o6tg",
			"created_at":"2009-12-22 14:33:32",
			"id":28335366,
			"user":{
				"login":"sagat",
				"sex":"m", 
				"avatar":{
					"url_90":"/user_generated/avatars/643514_standard.jpg",
					"url_120":"/user_generated/avatars/643514_large.jpg",
					"url":"http://blip.pl/user_generated/avatars/643514.jpg",
					"url_15":"/user_generated/avatars/643514_femto.jpg",
					"url_30":"/user_generated/avatars/643514_nano.jpg",
					"url_50":"/user_generated/avatars/643514_pico.jpg",
					"id":643514
				},
				"id":148300,
				"location":"Cz\u0119stochowa, poland"
			}
		};
		this.status = new Update(this.s);
		this.own_status = new Update(this.s, this.s.user.login);
	},
	tearDown : function() {
		delete this.s;
		delete this.status;
		delete this.own_status;
	},
	testConstructor : function() {
		this.assertEqual(this.status.short_type, 's');
	},
	testUserObject: function() {
		this.assertEqual(this.status.user.login, this.s.user.login);
	},
	testCreatedDate: function() {
		this.assertEqual(this.status.created_at, this.s.created_at);
	},
	testBody: function() {
		this.assertEqual(this.status.raw_body, this.s.body);
	},
	testUpdateHasNoPictures : function() {
		this.assertFalse(this.status.pictures);
	},
	testUpdateType : function() {
		this.assertEqual(this.status.type, this.s.type);
	},
	testToElement: function() {
		this.assertTrue();
	},
	testOwnUpdate : function() {
		this.assertTrue(this.own_status.cclass.test('own'));
	}
 });
