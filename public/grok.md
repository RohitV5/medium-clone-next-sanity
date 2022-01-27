*[_type == "post]{
        _id,
        slug{
            current
        }
    }


==========

*[_type == "post" && slug.current == slug[0]]{
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
        slug}