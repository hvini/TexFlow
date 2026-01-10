import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Load projects and user data
    useEffect(() => {
        // We can fetch user data here or use a context/store in the future.
        // For now, let's just listen to user doc for limits? 
        // Or just fetch once since we are on dashboard.
        // Actually we need to check the tier to enforce limits.

        // Let's assume passed via props or fetch again.
        // fetching here for simplicity.
        const fetchUserData = async () => {
            if (!auth.currentUser) return;
            try {
                // simplified: we'll check firestore in createProject too for security rule compliance?
                // But for UI feedback:
                const userDoc = await import('firebase/firestore').then(mod => mod.getDoc(mod.doc(db, 'users', auth.currentUser.uid)));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } catch (e) {
                console.error("Error fetching user", e);
            }
        };

        // Fetch Projects
        const fetchProjects = async () => {
            if (!auth.currentUser) return;
            try {
                const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                const projs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                projs.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
                setProjects(projs);
            } catch (e) {
                console.error("Error fetching projects", e);
            } finally {
                setLoading(false);
            }
        };

        if (auth.currentUser) {
            fetchUserData();
            fetchProjects();
        }
    }, []);

    const handleCreateProject = async () => {
        if (!auth.currentUser) return;

        // Limit Check
        const isFree = !userData || userData.tier === 'free';
        if (isFree && projects.length >= 1) {
            alert("Free Tier limited to 1 project. Upgrade to Premium to create more.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'projects'), {
                userId: auth.currentUser.uid,
                name: `Untitled Project ${projects.length + 1}`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                nodes: [
                    { id: 'root', type: 'rootNode', position: { x: 250, y: 5 }, data: { label: 'Start' } }
                ],
                edges: []
            });
            navigate(`/editor/${docRef.id}`);
        } catch (e) {
            console.error("Error creating project", e);
            alert("Failed to create project.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30">
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="font-bold text-lg">T</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">TeXFlow</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {userData && (
                                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                                    {userData.tier === 'premium' ? (
                                        <span className="text-amber-400 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            PREMIUM
                                        </span>
                                    ) : 'FREE TIER'}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                        <p className="text-gray-400">Manage your LaTeX workflows.</p>
                    </div>
                    <button
                        onClick={handleCreateProject}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No projects yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first LaTeX workflow.</p>
                        <button
                            onClick={handleCreateProject}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Create a project &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <Link
                                key={project.id}
                                to={`/editor/${project.id}`}
                                className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 block"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-indigo-900/30 text-gray-500 group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-600 font-mono">
                                        {project.updatedAt?.toDate ? project.updatedAt.toDate().toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {project.nodes?.length || 0} nodes • Last edited {project.updatedAt?.toDate ? project.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
