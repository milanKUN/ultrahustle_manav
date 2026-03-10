import { useEffect, useRef, useState } from "react";
import {
  deleteMyAvatar,
  getMyPersonalInfo,
  uploadMyAvatar,
} from "../../api/personalInfoApi";

export default function ProfileForm() {
  const TITLE_LIMIT = 40;
  const BIO_LIMIT = 160;

  const [title, setTitle] = useState("Product Designer & Full Stack Developer");
  const [bio, setBio] = useState(
    "Award-winning designer with 8+ years creating elegant, user-centered digital experiences. Specialized in design systems, mobile apps, and SaaS platforms."
  );

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [zoom, setZoom] = useState(0);
  const fileRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState(null);
  const [personalInfoLoading, setPersonalInfoLoading] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "";

  const toAbsoluteUrl = (maybeUrl) => {
    if (!maybeUrl || typeof maybeUrl !== "string") return "";
    if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) return maybeUrl;
    if (maybeUrl.startsWith("//")) return `${window.location.protocol}${maybeUrl}`;
    if (maybeUrl.startsWith("/")) return backendOrigin ? `${backendOrigin}${maybeUrl}` : maybeUrl;
    return backendOrigin ? `${backendOrigin}/${maybeUrl}` : maybeUrl;
  };

  const normalizePersonalInfo = (info) => info?.data || info;

  const loadPersonalInfo = async () => {
    setPersonalInfoLoading(true);
    try {
      const info = await getMyPersonalInfo();
      setPersonalInfo(info);
    } catch {
      // Keep UI functional even if personal info isn't available yet.
      setPersonalInfo(null);
    } finally {
      setPersonalInfoLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarError("");
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const normalized = normalizePersonalInfo(personalInfo);

  const displayName =
    [normalized?.first_name ?? normalized?.firstName, normalized?.last_name ?? normalized?.lastName]
      .filter(Boolean)
      .join(" ") ||
    normalized?.username ||
    normalized?.contact_email ||
    normalized?.email ||
    "My Profile";

  const rawAvatarUrl =
    normalized?.avatar_url ||
    normalized?.avatarUrl ||
    normalized?.avatar ||
    normalized?.profile_image_url ||
    "";

  const avatarUrl = toAbsoluteUrl(rawAvatarUrl);

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setAvatarError("Please select an image.");
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_BYTES) {
      setAvatarError("Maximum upload size is 10 MB.");
      return;
    }

    setAvatarBusy(true);
    setAvatarError("");
    try {
      await uploadMyAvatar(selectedFile);
      await loadPersonalInfo();
      setOpenImageModal(false);
      setSelectedFile(null);
      setSelectedImage(null);
      setZoom(0);
    } catch (err) {
      setAvatarError(err?.message || "Failed to upload avatar.");
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarBusy(true);
    setAvatarError("");
    try {
      await deleteMyAvatar();
      await loadPersonalInfo();
      setSelectedFile(null);
      setSelectedImage(null);
      setZoom(0);
      setOpenImageModal(false);
    } catch (err) {
      setAvatarError(err?.message || "Failed to delete avatar.");
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <>
      {/* ================= PROFILE FORM ================= */}
      <div
        className="

        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            mb-6
            items-center gap-4
          "
        >
          <h3
            className="
              text-xl font-semibold
            "
          >
            My Profile
          </h3>
          <div
            className="
              flex-1
              h-px
              bg-[#2B2B2B]
            "
          />
        </div>

        {/* PROFILE BAR */}
        {/* PROFILE BAR */}
        <div
          className="
    flex flex-col
    w-full
    px-6 py-6
    bg-[#FEFEFE]
    rounded-xl
    border-[0.5px] border-[#CEFF1B]
    relative
    gap-6
    backdrop-blur-3xl
    profile-card
    md:flex-row md:items-center md:justify-between
  "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div
              onClick={() => setOpenImageModal(true)}
              className="
    relative
    w-20 h-20
    rounded-full
    bg-[#D9D9D9]
    cursor-pointer
    flex items-center justify-center
  "
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : null}
              {/* EDIT BADGE */}
              <span
                className="
    absolute
    bottom-0 right-0
    w-7 h-7
    rounded-full
    flex items-center justify-center
    shadow-lg
    bg-white
    profile-avatar-badge
  "
              >
                <img
                  src="/edit.svg"
                  alt="Edit"
                  className="w-4 h-4"
                />
              </span>


            </div>


            {/* NAME */}
            <span
              className="
        text-[22px]
        font-semibold
        text-gray-900
        profile-name
      "
            >
              {personalInfoLoading ? "Loading..." : displayName}
            </span>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => setOpenFriends(true)}
            className="
      flex
      px-6 py-2.5
      font-medium
      bg-[#CEFF1B]
      rounded-lg
      border border-[#2B2B2B]
      items-center justify-center
      gap-2
      hover:opacity-90
      self-start
      md:self-center
    "
          >
            <img
              src="/Vector.svg"
              alt="Friends"
              className="w-5 h-5"
            />
            Friend List
          </button>
        </div>


        {/* FORM */}
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {openImageModal && (
        <div
          className="
            z-50 flex
            md:mt-20 p-4 md:p-0
            fixed inset-0 items-center justify-center image-modal
            backdrop-blur-sm bg-black/30
          "
        >
          <div
            className="
              flex flex-col items-center
              w-[90%] max-w-[380px] h-auto max-h-[90vh] overflow-y-auto
              p-5 md:p-6
              rounded-2xl
              image-modal-card relative
            "
          >
            <button
              onClick={() => {
                setOpenImageModal(false);
                setSelectedFile(null);
                setSelectedImage(null);
                setZoom(0);
                setAvatarError("");
              }}
              className="
                text-red-500 font-bold
                absolute top-4 right-4
              "
            >
              ✕
            </button>

            <h3
              className="
                mb-6
                text-center font-semibold text-gray-800
              "
            >
              Resize and adjust <br /> your photo
            </h3>

            <div
              className="
                flex
                w-full aspect-square max-w-[280px]
                mb-5 mx-auto
                bg-[#2B2B2B]
                rounded-xl
                items-center justify-center
                relative overflow-hidden
              "
              onClick={() => {
                if (!avatarBusy) fileRef.current?.click();
              }}
            >
              {selectedImage || avatarUrl ? (
                <>
                  <img
                    src={selectedImage || avatarUrl}
                    alt="Preview"
                    className="preview-image w-full h-full object-cover transition-transform duration-200"
                    style={{ transform: `scale(${1 + zoom / 100})` }}
                  />
                  {/* CIRCULAR PREVIEW OVERLAY */}
                  <div
                    className="
                      absolute inset-0
                      pointer-events-none
                      flex items-center justify-center
                    "
                  // style={{
                  //   background: "radial-gradient(circle, transparent 130px, rgba(0,0,0,0.5) 130px)"
                  // }}
                  >
                    <div
                      className="
                        w-[230px] h-[230px] md:w-[250px] md:h-[250px]
                        rounded-full
                        border-2 border-white/50
                      "
                    />
                  </div>
                </>
              ) : (
                <button
                  onClick={() => fileRef.current.click()}
                  className="
                    w-[157px] h-[58.41px]
                    text-sm
                    bg-white
                    rounded
                  "
                >
                  Select Image
                </button>
              )}
              <input type="file" ref={fileRef} hidden onChange={handleFileChange} />
            </div>

            <p
              className="
                mb-2
                text-xs text-center text-red-500
                -mt-6
              "
            >
              {avatarError || "Maximum upload size: 10 MB"}
            </p>
            <div
              className="
                flex w-full max-w-[280px] mx-auto
                mb-6
                items-center justify-between gap-3
                zoom-bar
              "
            >
              {/* MINUS */}
              <button
                onClick={() => setZoom(Math.max(0, zoom - 10))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <img
                  src="/minus.svg"
                  alt="Decrease"
                  className="w-5 h-5 filter invert brightness-0"
                />
              </button>

              {/* RANGE */}
              <input
                type="range"
                min="0"
                max="100"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="
                  flex-1
                  accent-[#CEFF1B]
                "
              />

              {/* PLUS */}
              <button
                onClick={() => setZoom(Math.min(100, zoom + 10))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <img
                  src="/plus.svg"
                  alt="Increase"
                  className="w-5 h-5 filter invert brightness-0"
                />
              </button>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={handleUploadAvatar}
                disabled={avatarBusy}
              className="
                w-full
                mt-auto py-3
                font-medium
                bg-[#CEFF1B]
                rounded-md
                disabled:opacity-60
              "
            >
                {avatarBusy ? "Uploading..." : "Upload Photo"}
              </button>

              {avatarUrl ? (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={avatarBusy}
                  className="w-full py-3 font-medium rounded-md border border-[#2B2B2B] bg-white disabled:opacity-60"
                >
                  {avatarBusy ? "Please wait..." : "Remove Photo"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ================= FRIEND LIST MODAL ================= */}
      {openFriends && <FriendListModal onClose={() => setOpenFriends(false)} />}
    </>
  );
}

/* ================= FRIEND LIST MODAL ================= */

function FriendListModal({ onClose }) {
  const [tab, setTab] = useState("list");

  const [friendList, setFriendList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: "User Name",
    }))
  );

  const [suggestionList, setSuggestionList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 100,
      name: "User Name",
    }))
  );

  const removeFriend = (id) => {
    setFriendList(friendList.filter((u) => u.id !== id));
  };

  const removeSuggestion = (id) => {
    setSuggestionList(suggestionList.filter((u) => u.id !== id));
  };

  const currentList = tab === "list" ? friendList : suggestionList;

  return (
    <div
      className="
        z-50 flex
        md:mt-20 p-4 md:p-0
        bg-black/60
        backdrop-blur-sm
        fixed inset-0 items-center justify-center friend-modal
      "
    >
      <div
        className="w-[95%] max-w-[620px] max-h-[90vh] p-5 md:p-8 rounded-[16px] flex flex-col friend-modal-card relative bg-white dark:bg-[#121212] border-2 border-[#CEFF1B] dark:border-[#CEFF1B] shadow-[0_0_40px_rgba(206,255,27,0.5)] dark:shadow-[0_0_50px_rgba(206,255,27,0.6)] transition-colors"
      >
        <button
          onClick={onClose}
          className="
            text-gray-600 text-lg
            absolute top-4 right-4
          "
        >
          ✕
        </button>

        {/* TABS */}
        <div
          className="
            flex
            flex-wrap
            mb-1 md:mb-3
            font-semibold
            justify-center gap-4 md:gap-16
          "
        >
          <button
            onClick={() => setTab("list")}
            className={`
              px-5 py-1.5
              rounded-lg
              ${tab === "list" ? "bg-[#CEFF1B]" : ""}
            `}
          >
            Your List
          </button>

          <button
            onClick={() => setTab("suggestions")}
            className={`
              px-5 py-1.5
              rounded-lg
              ${tab === "suggestions" ? "bg-[#CEFF1B]" : ""}
            `}
          >
            Suggestions
          </button>
        </div>

        <div
          className="
            h-[1px]
            mb-2 md:mb-3
            bg-[#000000]
            divider
          "
        />

        {/* SEARCH */}
        <div
          className="
            mb-3 md:mb-5
            relative
          "
        >
          <input
            placeholder="Search here"
            className="
              w-full
              px-5 py-2.5
              text-sm text-left
              bg-white
              rounded-full border border-gray-300
              placeholder:text-center focus:outline-none focus:ring-0 focus:border-gray-300
            "
          />

          <span
            className="
              text-gray-500
              pointer-events-none
              absolute right-5 top-2.5
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* LIST */}
        <div
          className="
            overflow-y-auto
            max-h-[360px]
            pr-2 space-y-5
            custom-scroll
          "
        >
          {currentList.map((u) => (
            <div
              key={u.id}
              className="
                flex
                items-center justify-between
              "
            >
              <div
                className="
                  flex
                  items-center gap-4
                "
              >
                <div
                  className="
                    w-11 h-11
                    bg-[#D9D9D9]
                    rounded-full
                  "
                />
                <span
                  className="
                    text-sm
                  "
                >
                  {u.name}
                </span>
              </div>

              {tab === "list" ? (
                <div
                  className="
                    flex
                    gap-3
                  "
                >
                  <button
                    className="
                      px-4 py-1.5
                      text-xs
                      bg-[#CEFF1B]
                      rounded-md
                    "
                  >
                    Following
                  </button>
                  <button
                    onClick={() => removeFriend(u.id)}
                    className="
                      px-4 py-1.5
                      text-xs
                      border rounded-md
                    "
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  <button
                    className="
                      px-5 py-1.5
                      text-xs
                      bg-[#CEFF1B]
                      rounded-md
                    "
                  >
                    Follow
                  </button>
                  <button
                    onClick={() => removeSuggestion(u.id)}
                    className="
                      text-gray-500
                    "
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
