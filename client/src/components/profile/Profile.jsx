import "./Profile.css";
import { Divider, Form as AntForm, Modal, Drawer, Button } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserAvatar } from "../userAvatar/UserAvatar";
import { updatePassword } from "../../store/actions/Users.action";
import { ConditionalRendering, readableText } from "../../utils/Methods";
import { renderContactDetails, renderOnboardingDetails, renderPrimaryDetails, renderRoleAndAccess } from "./Helper";
import { UserDeleteOutlined } from "@ant-design/icons";
import { useACL } from '../../utils/acl/UseACL'
import { ACL_ACCESS_LIST, ACL_MODULES } from "../../utils/acl/Index";
import OffboardingForm from "../offboarding/OffboardingForm";

const Profile = ({ isProfileOpen, setIsProfileOpen, userData, setIsProfileDrawerOpen, isProfileDrawerOpen }) => {

  const [form] = AntForm.useForm();

  const [showinput, setshowinput] = useState(false);
  const [isOpenResignationModal, setIsOpenResignationModal] = useState(false)
  const [selected, setSelected] = useState()

  const dispatch = useDispatch();

  const { can } = useACL();


  const { profileData, isSuperAdmin } = useSelector(({ auth }) => ({
    profileData: auth?.user,
    isSuperAdmin: auth?.user?.isSuperAdmin
  }));

  const canAllowOffBoardUser = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.OFF_BOARD_MEMBERS) || isSuperAdmin

  const onCancel = () => {
    setIsProfileOpen(false)
  }

  const offBoardingModalHandler = (val = false) => {
    setIsOpenResignationModal(val)
    setSelected(userData?._id)
  }

  const offBoardingCloseModalHandler = (val = false) => {
    setIsOpenResignationModal(false)
    setSelected()
  }

  const renderFooter = () => {
    return (
      <Button
        danger
        shape="round"
        icon={<UserDeleteOutlined />}
        size="large"
        onClick={() => offBoardingModalHandler(true)}
      >
        <span className="btn-text">Apply Resignation</span>
      </Button>
    );
  };


  return (
    <>
      <Modal
        closable
        footer={null}
        onCancel={() => { onCancel(); setshowinput(false); }}
        open={isProfileOpen}
        width={400}
      >
        <div className="profile-modal">
          <div className="profile-icon-parent">
            <UserAvatar
              name={
                profileData?.user?.firstName ||
                userData?.user?.firstName ||
                userData?.firstName ||
                "-"
              }
            />
          </div>
          <h1 className="profile-name">
            {[userData?.firstName, userData?.lastName].filter(Boolean).join(" ")}
          </h1>

          <Divider size="small" className="ant-divider" />

          <AntForm layout="vertical" form={form}>
            <label className="profile-label">Role</label>
            <p className="profile-data">
              {readableText(profileData?.user?.role || userData?.user?.role || userData?.role) || "-"}
            </p>
            <Divider size="small" className="ant-divider" />

            <>
              <label className="profile-label">Department</label>
              <p className="profile-data">
                {readableText(profileData?.user?.department[0]?.title ||
                  userData?.user?.department[0]?.title ||
                  userData?.department[0]?.title ||
                  "-")}
              </p>
              <Divider size="small" className="ant-divider" />
            </>

            <label className="profile-label">Work Email</label>
            <p className="profile-data">
              {profileData?.user?.email ||
                userData?.user?.email ||
                userData?.email ||
                "-"}
            </p>
            <Divider size="small" className="ant-divider" />
            <>
              {/* {showinput && (
                  <>
                    <h2 className="auth-title">Change Password</h2>

                    <AntForm.Item
                      label={<span className="form-label">New Password</span>}
                      validateStatus={
                        touched.password && errors.password ? "error" : ""
                      }
                      help={
                        touched.password &&
                        errors.password && (
                          <span className="form-error">{errors.password}</span>
                        )
                      }
                    >
                      <Input.Password
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-input"
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      label={<span className="form-label">Confirm Password</span>}
                      validateStatus={
                        touched.confirmPassword && errors.confirmPassword
                          ? "error"
                          : ""
                      }
                      help={
                        touched.confirmPassword &&
                        errors.confirmPassword && (
                          <span className="form-error">
                            {errors.confirmPassword}
                          </span>
                        )
                      }
                    >
                      <Input.Password
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-input"
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                      />
                    </AntForm.Item>

                    <div className="profile-btns margin-top_20">
                      <Button
                        className="profile-btn"
                        onClick={() => {
                          setshowinput(false);
                          handleSubmit({ values: initialValues });
                          handleReset();
                        }}
                        block
                      >
                        Cancel
                      </Button>
                      <Button
                        className="profile-btn"
                        onClick={handleSubmit}
                        type="primary"
                        block
                        loading={loading}
                        disabled={!isValid || !dirty || loading}
                      >
                        Update Password
                      </Button>
                    </div>
                  </>
                )} 
                
              <ConditionalRendering
                condition={userData?.isActive && !userData?.isFirstLogin}
                children={
                  {!showinput && (
              <div className="profile-btns margin-top_20">
                <Button
                  className="profile-btn"
                  onClick={() => setshowinput(true)}
                  type="primary"
                  icon={<MdOutlineLock />}
                >
                  Change Password
                </Button>
              </div>
                    )}
                }
              /> */}
            </>
          </AntForm>
        </div>
      </Modal>

      <Drawer
        title="Employee Profile Details"
        placement="right"
        width={720}
        onClose={() => setIsProfileDrawerOpen(false)}
        open={isProfileDrawerOpen}
        footer={canAllowOffBoardUser && renderFooter()}
      >
        {renderPrimaryDetails(userData)}
        {renderContactDetails(userData)}
        {renderOnboardingDetails(userData)}
        {renderRoleAndAccess(userData)}
      </Drawer>

      <OffboardingForm
        open={isOpenResignationModal}
        selected={selected}
        setSelected={setshowinput}
        close={() => offBoardingCloseModalHandler()}
      />
    </>
  );
};

export default Profile;