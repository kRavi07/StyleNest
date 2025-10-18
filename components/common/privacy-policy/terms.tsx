import fs from "fs";
import path from "path";

export default async function TermsConditions() {
    const filePath = path.join(process.cwd(), "public", "terms-condition.html");
    const htmlContent = fs.readFileSync(filePath, "utf8");

    return (
        <>
            <div className="container mx-auto p-6 bg-white">

                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </>
    );
}
