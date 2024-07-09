const SUCCESS = "success";
const ERROR = "error";
function messageBoxChild(isStatus, messageText) {
    $("#message").css("animation-duration", "3s");
    $("#message").css("animation-name", "move");
    $("#message").show();
    if (isStatus == SUCCESS) {
        $("#message").removeClass("bg-warning");
        $("#messageText").removeClass("text-dark")
        $("#message").addClass("bg-success");
        $("#messageText").addClass("text-white")
        $("#messageText").html(messageText + " success");
    } else if (isStatus == ERROR) {
        $("#message").removeClass("bg-success");
        $("#messageText").removeClass("text-white")
        $("#message").addClass("bg-warning");
        $("#messageText").addClass("text-dark")
        $("#messageText").html(messageText + " error");
    }

}
function messageBox(isStatus,messageText) {
   $(window).scrollTop(0);
    let startMessageBox = setTimeout(messageBoxChild(isStatus, messageText), 100);
    let stopMessageBox = setTimeout(() => {
        clearTimeout(startMessageBox);
        $("#message").hide();
    }, 3100);
}
export  {messageBox,SUCCESS,ERROR};