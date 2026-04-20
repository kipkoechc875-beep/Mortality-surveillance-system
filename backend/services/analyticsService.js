const db = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

exports.getStatistics = (callback) => {
  const query = `
    SELECT cause_of_death, COUNT(*) as total
    FROM deaths
    GROUP BY cause_of_death
  `;
  db.query(query, callback);
};

exports.getAIRecommendations = async () => {
  try {
    // Fetch death data with location info
    const query = `
      SELECT d.cause_of_death, d.location, l.name as location_name, COUNT(*) as count
      FROM deaths d
      LEFT JOIN locations l ON d.location = l.id
      GROUP BY d.cause_of_death, d.location, l.name
      ORDER BY count DESC
    `;
    
    const [rows] = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });

    if (rows.length === 0) {
      return { summary: "No death data available for analysis.", recommendations: [] };
    }

    // Format data for Gemini
    const dataSummary = rows.map(row => 
      `${row.cause_of_death}: ${row.count} deaths in ${row.location_name || 'Unknown Location'}`
    ).join('\n');

    const prompt = `
      Analyze the following mortality data from a surveillance system. The data shows causes of death and their counts by location:

      ${dataSummary}

      Please provide:
      1. A brief summary of the mortality patterns observed.
      2. Identify the highest cause of death and which areas it affects most.
      3. Propose 3-5 practical solutions that management can implement to address the leading causes of death.

      Format your response as JSON with keys: summary, highestCause, affectedAreas, solutions (array of strings).
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const parsedResponse = JSON.parse(text);

    return {
      summary: parsedResponse.summary,
      highestCause: parsedResponse.highestCause,
      affectedAreas: parsedResponse.affectedAreas,
      solutions: parsedResponse.solutions
    };
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    throw new Error("Failed to generate AI recommendations");
  }
};