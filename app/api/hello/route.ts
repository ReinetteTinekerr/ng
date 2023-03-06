const docs = require('@googleapis/docs')

export async function GET(request: Request) {
  const auth = new docs.auth.GoogleAuth({ keyFilename: './secret.json', scopes: ['https://www.googleapis.com/auth/documents.readonly'] })
  
  const authClient = await auth.getClient();
  const client = await docs.docs({
    version: 'v1',
    auth: authClient
  });
  const res = await client.documents.get({ documentId: '1EFCR_D8mosNVDUBMYhc-2Q8srI758kXvjF-yIZm-OP0' })
  const { data } = res;
  // console.log(data);
  const doc = data.body.content.reduce((acc:any, cur:any) => {
    if (cur.paragraph) {
      acc += cur.paragraph.elements.reduce(
        (text:any, el:any) => text + el.textRun.content,
        ''
      );
    }
    return acc;
  }, '');
  // console.log(doc);
  
  
  return new Response(JSON.stringify(doc), { status: 200, headers: {'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'}})

}
