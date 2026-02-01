(() => {
  const applyClasses = () => {
    const tables = document.querySelectorAll(".comparison-table table");
    if (!tables.length) return false;
    tables.forEach((table) => {
      const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
        th.textContent.trim()
      );
      const nameIndex = headers.indexOf("name");
      const urlIndex = headers.indexOf("url");

      if (urlIndex !== -1) {
        const headerCell = table.querySelectorAll("thead th")[urlIndex];
        if (headerCell) headerCell.classList.add("col-hidden");
      }

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (urlIndex !== -1 && cells[urlIndex]) {
          const url = cells[urlIndex].textContent.trim();
          if (url && nameIndex !== -1 && cells[nameIndex]) {
            const nameCell = cells[nameIndex];
            const nameText = nameCell.textContent.trim();
            if (nameText && !nameCell.querySelector("a")) {
              const link = document.createElement("a");
              link.href = url;
              link.target = "_blank";
              link.rel = "noopener";
              link.textContent = nameText;
              nameCell.textContent = "";
              nameCell.appendChild(link);
            }
          }
          cells[urlIndex].classList.add("col-hidden");
        }
      });

      const cells = table.querySelectorAll("tbody td");
      cells.forEach((cell) => {
        const rawText = cell.textContent.trim();
        let text = rawText;
        let status = "";
        if (rawText.includes("|")) {
          const parts = rawText.split("|");
          text = parts[0]?.trim() ?? rawText;
          status = parts[1]?.trim() ?? "";
        } else if (rawText === "y" || rawText === "n") {
          status = "docs";
        } else if (rawText === "Y" || rawText === "N") {
          status = "proven";
        }

        if (text === "Y" || text === "y") {
          cell.classList.add("yn-yes");
          if (status === "docs") {
            cell.classList.add("yn-doc");
            cell.textContent = "y";
          }
        }

        if (text === "N" || text === "n") {
          cell.classList.add("yn-no");
          if (status === "docs") {
            cell.classList.add("yn-doc");
            cell.textContent = "n";
          }
        }

        if (text === "P") {
          cell.classList.add("yn-partial");
          cell.textContent = "P";
        }
        if (text === "p") {
          cell.classList.add("yn-partial", "yn-doc");
          cell.textContent = "p";
        }

        if (text === "?" || text === "") {
          if (text === "") cell.textContent = "?";
          cell.classList.add("yn-unknown");
        }
      });
    });
    return true;
  };

  let tries = 0;
  const maxTries = 20;
  const timer = setInterval(() => {
    tries += 1;
    if (applyClasses() || tries >= maxTries) {
      clearInterval(timer);
    }
  }, 250);

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.jQuery) return;
    const tables = document.querySelectorAll(".comparison-table table");
    if (!tables.length) return;
    tables.forEach((table) => {
      const $table = window.jQuery(table);
      if ($table.data("DataTable")) {
        $table.on("draw.dt", applyClasses);
      }
    });
  });

  // Filters removed for now.
})();
