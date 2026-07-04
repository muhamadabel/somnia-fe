"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
  return (
    <div className="mt-10 w-full">
      <Giscus
        id="comments"
        repo="NAMAAKUN/NAMAREPO" // TODO: Ganti dengan username/repo GitHub kamu
        repoId="R_kgDOXXXXXX" // TODO: Ganti dengan repo ID dari https://giscus.app
        category="General" // TODO: Sesuaikan dengan nama kategori di GitHub Discussions
        categoryId="DIC_kwDOXXXXXX" // TODO: Ganti dengan category ID dari https://giscus.app
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="id"
        loading="lazy"
      />
    </div>
  );
}
