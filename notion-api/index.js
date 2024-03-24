// expressjs app with one endpoint that returns the recordMap object from the notion api of the given page ID
import { NotionAPI } from 'notion-client';
import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import notionOAuth from "./notion-oauth.json" with { type: "json" };
import fs from "fs";

console.log(process.env.NOTION_TOKEN_V2)

const notion = new NotionAPI({
	activeUser: "1806fc31-46dc-4304-a199-e4ea1b9c0e3f",
	authToken: process.env.NOTION_TOKEN_V2
});

const app = express();
app.use(cors());

app.get('/page/:pageId', async (req, res) => {
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
		redirect_uri: "http://localhost:3001/notion/auth/redirect",
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

app.listen(3001, () => {
	console.log('Server started on http://localhost:3001');
})