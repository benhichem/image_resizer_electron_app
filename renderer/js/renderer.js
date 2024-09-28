const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

console.log(versions.node())
function AllerSuccess(Message) {
  tosty.toast({
    text: Message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center"
    }
  })
}
function AllertError(errorMessage) {
  tosty.toast({
    text: errorMessage,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center"
    }
  })
}

function loadimage(e) {
  const file = e.target.files[0]

  if (!IsImage(file)) {
    AllertError('File type not supported ...')
    return;
  }
  // Add current height and width to form using the URL API
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function() {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  console.log('File Loaded 200 ...')
  filename.innerHTML = img.files[0].name;
  outputPath.innerText = path.join(os.homedir, 'imageresizer');
}



function IsImage(file) {
  const AllowedTypes = ["image/png", "image/gif", "image/jpeg"];
  return file && AllowedTypes.includes(file['type'])
}

function SendImage(e) {
  e.preventDefault();
  if (!img.files[0]) {
    AllertError("please upload an image ")
  }
  let height = heightInput.value;
  let width = widthInput.value;

  if (height === "" || width === "") {
    AllertError('Please enter a width and height to resize ')
  }
  const imagePath = img.files[0].path;
  ipcRenderer.send("image:resize", {
    imagePath,
    height,
    width
  })
}

img.addEventListener('change', loadimage)
form.addEventListener('submit', SendImage)

ipcRenderer.on('image:done', (e, options) => {

  AllerSuccess('Success ')
})
