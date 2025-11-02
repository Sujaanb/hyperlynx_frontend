import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7f9a4697/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-7f9a4697/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Failed to create user account' }, 500);
  }
});

// Helper function to verify user authentication
async function verifyUser(accessToken: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Save applicability assessment
app.post("/make-server-7f9a4697/applicability", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { answers, results } = body;

    // Store assessment data
    await kv.set(`applicability:${user.id}`, {
      userId: user.id,
      answers,
      results,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving applicability assessment:', error);
    return c.json({ error: 'Failed to save assessment' }, 500);
  }
});

// Get applicability assessment
app.get("/make-server-7f9a4697/applicability", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await kv.get(`applicability:${user.id}`);
    return c.json({ data });
  } catch (error) {
    console.error('Error getting applicability assessment:', error);
    return c.json({ error: 'Failed to get assessment' }, 500);
  }
});

// Initialize storage bucket for documents
async function initializeDocumentsBucket() {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const bucketName = 'make-7f9a4697-documents';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      console.log('Documents bucket created');
    }
  } catch (error) {
    console.error('Error initializing documents bucket:', error);
  }
}

// Initialize bucket on startup
initializeDocumentsBucket();

// Upload document
app.post("/make-server-7f9a4697/documents/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const bucketName = 'make-7f9a4697-documents';
    const fileExt = fileName.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Store metadata in KV
    const documentId = crypto.randomUUID();
    const metadata = {
      id: documentId,
      userId: user.id,
      fileName,
      fileType,
      filePath,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    await kv.set(`document:${documentId}`, metadata);
    
    // Add to user's document list
    const userDocsKey = `user_documents:${user.id}`;
    const userDocs = await kv.get(userDocsKey) || [];
    userDocs.push(documentId);
    await kv.set(userDocsKey, userDocs);

    return c.json({ success: true, documentId, metadata });
  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// Get user documents
app.get("/make-server-7f9a4697/documents", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userDocsKey = `user_documents:${user.id}`;
    const documentIds = await kv.get(userDocsKey) || [];
    
    const documents = [];
    for (const docId of documentIds) {
      const doc = await kv.get(`document:${docId}`);
      if (doc) {
        documents.push(doc);
      }
    }

    return c.json({ documents });
  } catch (error) {
    console.error('Error getting documents:', error);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

// Download document
app.get("/make-server-7f9a4697/documents/:id/download", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const documentId = c.req.param('id');
    const doc = await kv.get(`document:${documentId}`);

    if (!doc || doc.userId !== user.id) {
      return c.json({ error: 'Document not found' }, 404);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const bucketName = 'make-7f9a4697-documents';
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(doc.filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return c.json({ error: 'Failed to generate download URL' }, 500);
    }

    return c.json({ url: data.signedUrl, fileName: doc.fileName });
  } catch (error) {
    console.error('Error downloading document:', error);
    return c.json({ error: 'Failed to download document' }, 500);
  }
});

// Delete document
app.delete("/make-server-7f9a4697/documents/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const documentId = c.req.param('id');
    const doc = await kv.get(`document:${documentId}`);

    if (!doc || doc.userId !== user.id) {
      return c.json({ error: 'Document not found' }, 404);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Delete from storage
    const bucketName = 'make-7f9a4697-documents';
    await supabase.storage.from(bucketName).remove([doc.filePath]);

    // Remove from KV
    await kv.del(`document:${documentId}`);

    // Remove from user's document list
    const userDocsKey = `user_documents:${user.id}`;
    const userDocs = await kv.get(userDocsKey) || [];
    const updatedDocs = userDocs.filter(id => id !== documentId);
    await kv.set(userDocsKey, updatedDocs);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return c.json({ error: 'Failed to delete document' }, 500);
  }
});

// Get/Update user profile
app.get("/make-server-7f9a4697/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ 
      email: user.email,
      name: user.user_metadata?.name || '',
      id: user.id,
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

app.put("/make-server-7f9a4697/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await verifyUser(accessToken ?? '');
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { name } }
    );

    if (error) {
      console.error('Error updating profile:', error);
      return c.json({ error: 'Failed to update profile' }, 500);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

Deno.serve(app.fetch);