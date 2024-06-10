
import seedUsers from "./users/seed.user.data";
import seedPosts from "./posts/seed.post.data";
import { logger } from "../libs/pino";

const seedAll = async () => {
    await seedUsers();
    await seedPosts();
}

seedAll().catch(logger.error).finally(() => process.exit(0));