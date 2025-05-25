# AI Chat Application

## Recent Updates

### Unified Chat Endpoint

The chat API has been unified to use a single endpoint for all types of messages:

- `/api/chat/ask` now handles text messages, document uploads, and image uploads
- The `/api/chat/document` and `/api/chat/image` endpoints have been removed

This simplifies the API and makes it more consistent. All client code should be updated to use the unified endpoint.

## How to Use the Unified Endpoint

### Text Messages

```typescript
// Send a text message
const response = await api.post('/chat/ask', {
  content: 'Your message here',
  chatId: 123, // optional
  country: 'US', // optional
  language: 'en' // optional
});
```

### Document Uploads

```typescript
// Send a message with a document
const formData = new FormData();
formData.append('content', 'Your message here');
formData.append('document', documentFile);
if (chatId) formData.append('chatId', chatId.toString());
if (country) formData.append('country', country);
if (language) formData.append('language', language);

const response = await api.post('/chat/ask', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Image Uploads

```typescript
// Send a message with an image
const formData = new FormData();
formData.append('content', 'Your message here');
formData.append('image', imageFile);
if (chatId) formData.append('chatId', chatId.toString());
if (country) formData.append('country', country);
if (language) formData.append('language', language);

const response = await api.post('/chat/ask', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```
