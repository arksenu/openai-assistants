export let assistantId = "asst_NopH7zv5gH4qhH5QOx5wvHWj"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
