import { GetStaticProps } from "next";
import React from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity.config";
import { Post } from "../../typings";

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  console.log(post);
  return (
    <main>
      <Header />
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;

  const posts = await sanityClient.fetch(query);

  console.log(posts);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("params===>", params);
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        slug,
        author -> {
          name,
          image
        },
        description, 
        mainImage, 
        slug,
        body
        
      }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  console.log(post);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //after this many seconds it will update the old cached version
  };
};
