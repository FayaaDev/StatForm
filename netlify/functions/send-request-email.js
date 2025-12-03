export const handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Method Not Allowed" }) 
        };
    }

    try {
        const { email, formName, details } = JSON.parse(event.body);

        // Validate required fields
        if (!email || !formName || !details) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields" }),
            };
        }

        // Get Resend API key from environment variables
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("RESEND_API_KEY missing in environment variables");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Server configuration error" }),
            };
        }

        // Send email using Resend API
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "StatForm <noreply@statform.app>",
                to: ["support@statform.app"],
                reply_to: email,
                subject: `Custom Form Request: ${formName}`,
                html: `
                    <h2>New Custom Form Request</h2>
                    <p><strong>From:</strong> ${email}</p>
                    <p><strong>Form Name:</strong> ${formName}</p>
                    <h3>Details & Specifications:</h3>
                    <p>${details.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">This request was submitted through StatForm's custom form request feature.</p>
                `,
                text: `
New Custom Form Request

From: ${email}
Form Name: ${formName}

Details & Specifications:
${details}

---
This request was submitted through StatForm's custom form request feature.
                `.trim(),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Resend API Error:", errorData);
            throw new Error(errorData.message || "Failed to send email");
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                success: true,
                message: "Email sent successfully",
                id: data.id 
            }),
        };
    } catch (error) {
        console.error("Email sending error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                error: "Failed to send email",
                message: error.message 
            }),
        };
    }
};
