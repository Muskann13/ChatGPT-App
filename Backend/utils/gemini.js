import "dotenv/config";

const getGeminiAIAPIResponse=async(message)=>{
    const options={
    method:"POST",
     headers:{
      "Content-Type": "application/json",
      "x-goog-api-key":`${process.env.GEMINI_API_KEY}` 
     },
     body:JSON.stringify({
      contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
      })
  };
  try{
  const response= await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",options);
  const data=await response.json();

  if (!data.candidates) {
  console.log("API ERROR:", data);
  return res.status(500).send(data.error?.message || "Something went wrong");
}
  return data.candidates[0].content.parts[0].text
  } catch(err){
    console.log(err);
  }
}

export default getGeminiAIAPIResponse;