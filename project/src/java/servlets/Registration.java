/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;
import mainClasses.User;

public class Registration extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSON_Converter jc = new JSON_Converter();
        String jsonData = jc.getJSONFromAjax(request.getReader());
        Gson gson = new Gson();
        User u = gson.fromJson(jsonData, User.class);

        boolean isDoctor = false;
        boolean isUser = false;
        if (u.getUsertype() != null) {
            isDoctor = u.getUsertype().equalsIgnoreCase("doctor"); //(jsonData.indexOf("usertype:\"doctor\"") != -1);
            isUser = u.getUsertype().equalsIgnoreCase("user");//(jsonData.indexOf("usertype:\"user\"") != -1);
        }

        EditSimpleUserTable esut = new EditSimpleUserTable();
        EditDoctorTable edt = new EditDoctorTable();

        response.setCharacterEncoding("UTF-8");
        try {
            if ((u.getUsername() != null) && (u.getAmka() != null) && (u.getEmail() != null)) {
                /*Registration*/
                if (isDoctor) {
                    Doctor d = gson.fromJson(jsonData, Doctor.class);
                    d.setCertified(0);
                    edt.addNewDoctor(d);
                } else if (isUser) {
                    SimpleUser su = gson.fromJson(jsonData, SimpleUser.class);
                    esut.addNewSimpleUser(su);
                } else {
                    response.setStatus(403);
                    return;
                }
            } else if (u.getUsername() != null) {
                boolean simpleUsernameExists = esut.itemExists(u.getUsername(), EditSimpleUserTable.UserItem.USERNAME);
                boolean doctorUsernameExists = edt.itemExists(u.getUsername(), EditDoctorTable.DoctorItem.USERNAME);
                if (simpleUsernameExists || doctorUsernameExists) {
                    response.setStatus(403);
                    return;
                }
            } else if (u.getAmka() != null) {
                boolean simpleAMKAExists = esut.itemExists(u.getAmka(), EditSimpleUserTable.UserItem.AMKA);
                boolean doctorAMKAExists = edt.itemExists(u.getAmka(), EditDoctorTable.DoctorItem.AMKA);
                if (simpleAMKAExists || doctorAMKAExists) {
                    response.setStatus(403);
                    return;
                }

            } else if (u.getEmail() != null) {
                boolean simpleEmailExists = esut.itemExists(u.getEmail(), EditSimpleUserTable.UserItem.EMAIL);
                boolean doctorEmailExists = edt.itemExists(u.getEmail(), EditDoctorTable.DoctorItem.EMAIL);
                if (simpleEmailExists || doctorEmailExists) {
                    response.setStatus(403);
                    return;
                }
            }

        } catch (SQLException sqlexc) {
            response.setStatus(403);
            /* TODO */
            return;
        } catch (ClassNotFoundException cnfe) {
            response.setStatus(403);
            /* TODO */
            return;
        }

        response.setStatus(200);
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Request-Method", "GET");
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Request-Method", "POST");
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
