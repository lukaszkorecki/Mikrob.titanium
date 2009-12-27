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
		this.s_with_pic = {
			"type":"Status",
			"pictures":[
				{
				"url":"http://blip.pl/user_generated/update_pictures/720014.jpg",
				"update_path":"/updates/29331038",
				"id":720014
				}
			],
			"body":"porz\u0105dek zobaczymy na jak d\u0142ugo",
			"created_at":"2009-12-27 11:13:29",
			"id":29331038,
			"transport":{
				"name":"api",
				"id":7
			},
			"user":{
				"login":"cuida",
				"background_path":"/users/cuida/background",
				"avatar":{
					"url_30":"/user_generated/avatars/642499_nano.jpg",
					"url_50":"/user_generated/avatars/642499_pico.jpg",
					"url_90":"/user_generated/avatars/642499_standard.jpg",
					"url":"http://blip.pl/user_generated/avatars/642499.jpg",
					"url_120":"/user_generated/avatars/642499_large.jpg",
					"url_15":"/user_generated/avatars/642499_femto.jpg",
					"id":642499
				}				,
				"id":36396,
				"sex":"m",
				"location":"Pozna\u0144, Polska"
			}
		};

		this.status = new Update(this.s);
		this.own_status = new Update(this.s, this.s.user.login);
		this.status_with_pic = new Update(this.s_with_pic);
		this.own_status_with_pic = new Update(this.s_with_pic, this.s_with_pic.user.login);
	},
	tearDown : function() {
		delete this.s;
		delete this.status;
		delete this.own_status;
	},
	testConstructor : function() {
		this.assertEqual(this.status.short_type, 's');
		this.assertEqual(this.status_with_pic.short_type, 's');
	},
	testUserObject: function() {
		this.assertEqual(this.status.user.login, this.s.user.login);
		this.assertEqual(this.status_with_pic.user.login, this.s_with_pic.user.login);
	},
	testCreatedDate: function() {
		this.assertEqual(this.status.created_at, this.s.created_at);
		this.assertEqual(this.status_with_pic.created_at, this.s_with_pic.created_at);
	},
	testBody: function() {
		this.assertEqual(this.status.raw_body, this.s.body);
		this.assertEqual(this.status_with_pic.raw_body, this.s_with_pic.body);
	},
	testUpdateHasNoPictures : function() {
		this.assertFalse(this.status.pictures);
	},
	testUpdateHasPictures : function() {
		var exp = (this.status_with_pic.pictures) ? true : false;
		this.assertTrue(exp);
	},
	testUpdateType : function() {
		this.assertEqual(this.status.type, this.s.type);
		this.assertEqual(this.status_with_pic.type, this.s_with_pic.type);
	},
//	testToElement: function() {
//		this.assert(this.status_with_pic.toElement());
//	},
	testOwnUpdate : function() {
		// strange JS bug - the same regexp produces strange results
		// @see http://log.coffeesounds.com/ech 
		var reg = /own/gi;
		var res = reg.test(this.own_status.cclass);
		this.assertTrue(res);
		var reg2 = /own/gi;
		res = reg2.test(this.own_status_with_pic.cclass);
		this.assertTrue(res);
	}
 });
