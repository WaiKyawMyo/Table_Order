import { z } from "zod"

const codeSchema = z.object({
    code: z.number()
        .int() // Ensure it's an integer
        .min(100000, "Code must be exactly 6 digits") // Minimum 6-digit number
        .max(999999, "Code must be exactly 6 digits") // Maximum 6-digit number
})

export default codeSchema