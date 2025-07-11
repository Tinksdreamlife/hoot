import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import * as hootService from '../../services/hootService';
import CommentForm from '../CommentForm/CommentForm';

const HootDetails = () => {
    const { hootId } = useParams();
    console.log('hootId', hootId);

    const [hoot, setHoot] = useState(null);

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

    // Verify the hoot state is set correctly:
    console.log('hoot state:', hoot);

    if (!hoot) return <main>Loading...</main>;

    const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

    return (
        <main>
            <section>
                <header>
                    <p>{hoot.category.toUpperCase()}</p>
                    <h1>{hoot.title}</h1>
                    <p>
                        {`${hoot.author.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
                    </p>
                </header>
                <p>{hoot.text}</p>
            </section>

            <section>
        <h2>Comments</h2>
        {/* Pass the handleAddComment function to the CommentForm Component */}
        <CommentForm handleAddComment={handleAddComment}/>

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>

        </main>
    );
};