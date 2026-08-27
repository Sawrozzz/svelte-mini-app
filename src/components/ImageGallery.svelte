<script lang="ts">
  import img1 from "../public/pngwing.com.png";
  import img2 from "../public/pngwing.com (1).png";
  import img3 from "../public/pngwing.com (2).png";
  import img4 from "../public/pngwing.com (3).png";

  const images = [
    { src: img1, alt: "pngwing 1" },
    { src: img2, alt: "pngwing 2" },
    { src: img3, alt: "pngwing 3" },
    { src: img4, alt: "pngwing 4" },
  ];
</script>

<div class="mt-10 space-y-6">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Gallery — original size</h2>
  <!-- No lazy loading, no resizing — render at intrinsic dimensions -->
  <div class="space-y-8 overflow-x-auto">
    {#each images as img (img.src)}
      <div class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-auto p-4 bg-white dark:bg-gray-900">
        <!-- deliberately no width/height, no object-fit, no lazy loading -->
        <img src={img.src} alt={img.alt} decoding="sync" style="display:block; max-width:none; width:auto; height:auto;" />
      </div>
    {/each}
  </div>
</div>
