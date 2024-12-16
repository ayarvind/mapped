import { CustomAlias } from '@prisma/client';
import { prisma } from '../config/prisma';

export async function checkIfCustomAliasExists(customAlias: string): Promise<CustomAlias | null> {
    try {
        const alias = await prisma.customAlias.findFirst({
            where: {
                alias: customAlias,
            },
        });

        return alias;
    } catch (error) {
        console.error("Error checking if custom alias exists:", error);
        throw new Error("Failed to check alias existence");
    }
}



// export async createAlias(customAlias: string, shortnerId: number): Promise<CustomAlias> {

// }