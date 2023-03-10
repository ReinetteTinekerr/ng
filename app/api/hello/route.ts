import { NextResponse } from "next/server";
const docs = require('@googleapis/docs')

export async function GET(request: Request) {
  const headers = request.headers;
  
  const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY || '{ privateKey: null }')
  
  const auth = new docs.auth.GoogleAuth({ projectId: process.env.GOOGLE_PROJECT_ID, credentials: {private_key: privateKey, client_email: process.env.GOOGLE_CLIENT_EMAIL}, scopes: ['https://www.googleapis.com/auth/documents.readonly'] })
  const authClient = await auth.getClient();
  const client = await docs.docs({
    version: 'v1',
    auth: authClient
  });
  const res = await client.documents.get({ documentId: '1EFCR_D8mosNVDUBMYhc-2Q8srI758kXvjF-yIZm-OP0' })
  const { data } = res;
  const doc = data.body.content.reduce((acc:any, cur:any) => {
    if (cur.paragraph) {
      acc += cur.paragraph.elements.reduce(
        (text:any, el:any) => text + el.textRun.content,
        ''
      );
    }
    return acc;
  }, '');
  // console.log(JSON.stringify(doc));
  
  return NextResponse.json(doc, {status:200}) ;

}
