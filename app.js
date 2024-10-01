defineM(
  "yasinc2-reload-userblocks",
  (mbrApp) => {
    mbrApp.regExtension({
      name: "yasinc2-reload-userblocks",
      events: {
        beforeAppLoad: () => {
          const reloadBtn = document.createElement("li");
          reloadBtn.id = "yasinc2-reload-userblocks";
          reloadBtn.setAttribute("data-tooltipster", "bottom");
          reloadBtn.setAttribute("title", "Reload Userblocks");
          reloadBtn.setAttribute("style", "height:50px;width:50px;display:flex;justify-content:center;align-items:center;cursor:pointer");
          reloadBtn.innerHTML = `<img src="` + mbrApp.getAddonDir("yasinc2-reload-userblocks") + "/reload.svg" + `" style="height:30px" />`;
          document.querySelector(".app-publish").insertAdjacentElement("afterend", reloadBtn);
        },

        load: () => {
          var app = mbrApp;
          var bridge = mbrApp.Core.Bridge;
          document.querySelector("#yasinc2-reload-userblocks").addEventListener("click", () => {
            if (navigator.onLine) {
              app.showDialog({
                title: "Reload Userblocks",
                body: "Mobirise will be restart after reading user blocks.",
                success: function () {
                  window.readUserblocks();
                },
                cancel: function () {},
              });
            } else {
              app.alertDlg("Error!!");
            }
          });

          window.readUserblocks = function () {
            document.body.insertAdjacentHTML("beforeend", loader);

            var ubPath = app.getAccountPath() + "/userblocks";
            bridge.dirList(
              ubPath,
              (fileList) => {
                console.log(fileList);
                var counter = fileList.length;
                fileList.forEach(function (item, index) {
                  var listPath = ubPath + "/" + item + "/list.json";
                  bridge.removeLocal(listPath, function (e) {
                    // console.log("File [" + listPath + "] Removed!", e);
                    bridge.dirList(
                      ubPath + "/" + item,
                      (fileList) => {
                        bridge.saveLocalFile(listPath, JSON.stringify(fileList), function (e) {
                          // console.log("File [" + listPath + "] Saved!", e);
                          if (index + 1 == counter) {
                            jobDone();
                          }
                        });
                      }, {
                        // names: ["*.txt"], // Search for all files with the .txt extension
                        filter: 2, // 1 = all files, 2 = by extension (eg = names"*.txt), 3 = size (minSize and maxSize), 4 = date (minDate and maxDate)
                        recursive: false, // Recursive search
                      }
                    );
                  });
                })
              }, {
                // names: ["*.txt"], // Search for all files with the .txt extension
                filter: 2, // 1 = all files, 2 = by extension (eg = names"*.txt), 3 = size (minSize and maxSize), 4 = date (minDate and maxDate)
                recursive: false, // Recursive search
              }
            );
          }

          function jobDone() {
            setTimeout(() => {
              document.getElementById("reload-userblocks-loader").remove();

              mbrApp.runSaveProject(function (a) {
                a ? console.log("Project saved.") : console.error("Error: unable to save current project");
                mbrApp.Core.Bridge.reload();
              })
            }, 3000);
          }

          var loader = `
          <div id="reload-userblocks-loader">
            <style>
              .loader-container {
                background: #159bc53d;
                position: fixed;
                top: 50%;
                left: 50%;
                padding: 100px;
                transform: translate(-50%, -50%);
                border-radius: 30px;
                backdrop-filter: blur(2px);
                border: 2px solid #159bc54d;
              }

              .loader {
                width: 55px;
                aspect-ratio: 1;
                --g1: conic-gradient(from 90deg at 3px 3px, #0000 90deg, #fff 0);
                --g2: conic-gradient(from -90deg at 22px 22px, #0000 90deg, #fff 0);
                background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
                background-size: 25px 25px;
                background-repeat: no-repeat;
                animation: l7 1.5s infinite;
              }

              @keyframes l7 {
                0% {
                  background-position: 0 0, 0 100%, 100% 100%
                }
                25% {
                  background-position: 100% 0, 0 100%, 100% 100%
                }
                50% {
                  background-position: 100% 0, 0 0, 100% 100%
                }
                75% {
                  background-position: 100% 0, 0 0, 0 100%
                }
                100% {
                  background-position: 100% 100%, 0 0, 0 100%
                }
              }
            </style>
            <div class="loader-container">
              <div class="loader"></div>
            </div>
          </div>
          `;
        },
      },
    });
  },
  ["mbrApp"]
);