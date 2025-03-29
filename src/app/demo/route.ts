import { NextResponse } from 'next/server';
import { createUser, getUser, uploadUserImage, getUserImageUrl } from '../../services/users';
import { createProject, getProject, listProjects, listProjectsByUser } from '../../services/projects';
import { ID } from 'appwrite';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Image upload and retrieval demo
        const imagePath = path.join(process.cwd(), 'public', 'assets', 'carousel6.png'); // Path to test image
        const imageBuffer = await fs.readFile(imagePath);
        const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
        const imageFile = new File([imageBlob], 'test-image.jpg', { type: 'image/jpeg' });

        const uploadedImage = await uploadUserImage(imageFile);
        const imageUrl = getUserImageUrl(uploadedImage.$id);

        // 1. Create a user
        const userData = {
            userId: ID.unique(),
            name: 'John Doe',
            email: 'john.doe@example.com',
            githubProfileLink: 'https://github.com/johndoe',
            skills: ['JavaScript', 'React', 'Node.js'],
            about: 'Full-stack developer with a passion for web technologies.',
        };
        const createdUser = await createUser(userData, uploadedImage.$id); // Pass imageId to createUser

        // 2. Retrieve the created user
        const retrievedUser = await getUser(createdUser.userId);

        // 3. Create a project associated with the user
        const projectData = {
            projectName: 'E-commerce Platform',
            description: 'Building a scalable e-commerce platform using React and Node.js.',
            skillsRequired: ['React', 'Node.js', 'Express.js', 'PostgreSQL'],
            teamSize: 5,
            projectProposer: createdUser.userId,
        };
        const createdProject = await createProject(projectData);

        // 4. Retrieve the project
        const retrievedProject = await getProject(createdProject.$id);

        // 5. List all projects
        const allProjects = await listProjects();

        // 6. List projects by user
        const userProjects = await listProjectsByUser(createdUser.userId);

        return NextResponse.json({
            createdUser,
            retrievedUser,
            uploadedImage,
            imageUrl,
            createdProject,
            retrievedProject,
            allProjects,
            userProjects,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}