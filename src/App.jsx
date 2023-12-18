import './App.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const POSTS = [
  {id: 1, title: "Post 1"},
  {id: 2, title: "Post 2"},
]

function App() {
  const queryClient = useQueryClient();

  // query ->  getting data
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  })

  // mutation -> changing data
  const newPostMutation = useMutation({
    mutationFn: (title) => wait(1000).then(() => POSTS.push({id: crypto.randomUUID(), title})),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })
  
  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>
  }

  return (
    <>
      {postsQuery.data.map(post => (
        <div key={post.id}>{post.title}</div>
        ))}
        <button 
          disabled={newPostMutation.isLoading} 
          onClick={() => newPostMutation.mutate("New Post")}
        >Add New</button>
    </>
  )
}

function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default App
