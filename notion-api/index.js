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

app.get('/page/:pageId', authenticateUser, async (req, res) => {
	try {
		const pageId = req.params.pageId;
		const recordMap = await notion.getPage(pageId);
		res.json(recordMap);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}

});

app.get("/image/:id", async (req, res) => {
	const blockID = req.params.id;
	const workspace = req.query.workspace
	// console.log(blockID)
	// console.log(workspace)
	var result = await fetch(`https://api.notion.com/v1/blocks/${blockID}`, {
		headers: {
			"Authorization": `Bearer ${notionOAuth.tokens[workspace]}`,
			"Notion-Version": "2022-06-28"
		}
	})
	var json = await result.json();

	// console.log(json)

	try {
		res.redirect(json.image.file.url);
	}
	catch (err) {
		res.status(500).send({ error: err.message });
	}
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