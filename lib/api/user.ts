export async function completeProfile(data: {
    phoneNumber: string;
    dateOfBirth: string;
}) {
    const res = await fetch("https://localhost:7160/api/User/update-basic-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to complete profile");
    }

    return await res.json();
}