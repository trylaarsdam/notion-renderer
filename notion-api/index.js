// expressjs app with one endpoint that returns the recordMap object from the notion api of the given page ID
import { NotionAPI } from 'notion-client';
import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import notionOAuth from "./notion-oauth.json" with { type: "json" };
import fs from "fs";
import admin from 'firebase-admin';

// console.log(process.env.NOTION_TOKEN_V2)

const notion = new NotionAPI({
	activeUser: "1806fc31-46dc-4304-a199-e4ea1b9c0e3f",
	authToken: notionOAuth.userToken
});

const app = express();
app.use(cors());

import serviceAccount from "./lms-backend-firebase.json" with { type: "json" };
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const authenticateUser = async (req, res, next) => {
	const idToken = req.headers.authorization;
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedToken;
		console.log(req.user)
		next();
	} catch (error) {
		res.status(401).json({ error: "Unauthorized" });
	}
};

app.use((req, res, next) => {
	console.log(req.method, req.url);
	next();
})

app.get('/page/:pageId', authenticateUser, async (req, res) => {
	try {
		const pageId = req.params.pageId;
		const recordMap = await notion.getPage(pageId, {signFileUrls: true});
		res.json(recordMap);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/image/:id", async (req, res) => {
	const blockID = req.params.id;

	console.log(blockID)
	var headers = {}
	headers.Cookie = "__cf_bm=DdXn9cIqMcUlhHfo7YYemQFB9H7sDAQiK0ODVZBOdC4-1711303012-1.0.1.1-qf3WSigAYTU2jRWpM1OkO9HbkvgpQZN5PGHOxVnVNuZtVeLRmpZOchLHL63kJTroZLeVreePz0eKYrP0dlhCFg; _cfuvid=Z7Q9V16Lex9St8hXT0bDYSDGd4ezmWJLtX.lYaNVi0w-1711234509468-0.0.1.1-604800000; device_id=698055d5-260a-4b57-bd9f-a1bc22d15791; notion_browser_id=3ae54f5c-896c-47fb-a958-65199555f6e3; notion_check_cookie_consent=false; token_v2=" + notionOAuth.userToken
	// console.log(url)
	// console.log(headers)
	console.log(req.query)
	var url = "https://www.notion.so/image/" + encodeURIComponent(blockID) + "?" + new URLSearchParams({"table": req.query.table, "id": req.query.id, "cache": req.query.cache})
	var image = await fetch(url, {headers: headers})

	// pipe the image to the response
	const imageBuffer = await image.arrayBuffer()
	console.log(imageBuffer)
	res.set("Content-Type", image.headers.get("Content-Type"))
	res.send(Buffer.from(imageBuffer));
})

app.get("/notion/auth/redirect", async (req, res) => {
	const code = req.query.code;
	console.log(req.query)
	console.log(code)
	const client = new Client();
	const response = await client.oauth.token({
		code: code,
		client_id: notionOAuth.clientID,
		client_secret: notionOAuth.clientSecret,
		redirect_uri: "https://api.lms.toddr.org/notion/auth/redirect",
		grant_type: "authorization_code"
	})
	console.log(response)
	const workspace = response.workspace_id
	const token = response.access_token
	// write to file
	notionOAuth.tokens[workspace] = token
	await fs.promises.writeFile("./notion-oauth.json", JSON.stringify(notionOAuth, null, 2))

	res.redirect("http://localhost:3000")
})

app.get("/enrollments/my", authenticateUser, async (req, res) => {
	const user = req.user;
	var queryResult = db.collection("Enrollment").where("userID", "==", user.uid)
	var querySnapshot = await queryResult.get();
	var enrollments = [];
	querySnapshot.forEach((doc) => {
		enrollments.push(doc.data());
	})
	var courses = [];

	if (enrollments.length != 0) {
		var coursesQuery = db.collection("Course").where("id", "in", enrollments.map((enrollment) => enrollment.courseID))
		var coursesQuerySnapshot = await coursesQuery.get();
		coursesQuerySnapshot.forEach((doc) => {
			courses.push(doc.data());
		})
	}

	res.json(courses);
})

app.get("/course/:id", authenticateUser, async (req, res) => {
	const courseID = req.params.id;
	var courseDoc = await db.collection("Course").doc(courseID).get();
	var course = courseDoc.data();
	res.json(course);
})

app.listen(3001, () => {
	console.log('Server started on https://api.lms.toddr.org');
})